import React, { useState, useRef } from "react";
import { FileText, Layers, ArrowUpRight, Edit2, X, Check } from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import FocusLock from 'react-focus-lock';
import clsx from "clsx";

const IconWrapper = ({ children = null, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <div className={`text-gray-500 flex items-center gap-2 ${className}`}>
        {children}
    </div>
);

const Icon = ({ icon: IconComponent }: { icon: React.ElementType }) => (
    <IconComponent className="w-5 h-5 text-gray-400 shrink-0" />
);

const FormInputField = ({
    icon: IconComponent,
    label,
    name,
    defaultValue,
    layoutId,
    type = "text"
}: {
    icon: React.ElementType,
    label: string,
    name: string,
    defaultValue: string,
    layoutId?: string,
    type?: string
}) => (
    <div className="flex items-center gap-2">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <Icon icon={IconComponent} />
            <span className="text-gray-500 w-[90px] shrink-0">{label}</span>
        </motion.div>
        <motion.div className="w-full border border-gray-200 rounded-lg focus-within:border-gray-400">
            <motion.input
                // Layout position here ensures that the text doesn't stretch when transition happens between span and input
                layout='position'
                type={type}
                name={name}
                layoutId={layoutId}
                defaultValue={defaultValue}
                className="w-full p-2 outline-none rounded-lg"
            />
        </motion.div>
    </div>
);

const ActionButton = ({
    type = "button",
    onClick,
    icon: IconComponent,
    label,
    variant = "default"
}: {
    type?: "button" | "submit" | "reset",
    onClick?: () => void,
    icon: React.ElementType,
    label: string,
    variant?: "default" | "primary"
}) => (
    <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        type={type}
        onClick={onClick}
        className={`px-4 py-2 rounded-lg flex items-center gap-1 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 ${variant === "primary"
            ? "bg-gray-800 text-white focus-visible:ring-gray-800"
            : "bg-gray-100 text-gray-700 focus-visible:ring-gray-200"
            }`}
    >
        <IconComponent className="w-5 h-5" />
        {label}
    </motion.button>
);

const TableCell = ({
    children,
    className = "",
    layoutId,
    isEditing
}: {
    children: React.ReactNode,
    className?: string,
    layoutId?: string,
    isEditing: boolean
}) => (

    // Layout position here ensures that the text doesn't stretch when transition happens between span and input
    <motion.div layout='position' layoutId={layoutId} className={`${className} truncate`}>
        <motion.span
            animate={{
                opacity: isEditing ? 0.3 : 1,
                filter: isEditing ? "blur(0.5px)" : "blur(0px)",
            }}
        >
            {children}
        </motion.span>
    </motion.div>
);

export const InlineTableControl = () => {
    const [expenses, setExpenses] = useState([
        { id: 1, expense: "Rent", method: "Bank Transfer", amount: 1200 },
        { id: 2, expense: "Insurance", method: "Credit Card", amount: 149 },
        { id: 3, expense: "Groceries", method: "Wallet", amount: 205 },
        { id: 4, expense: "Utilities", method: "Credit Card", amount: 180 },
        { id: 5, expense: "Bill", method: "Cash", amount: 79 },
    ]);

    const [editingId, setEditingId] = useState<number | null>(null);

    const formRef = useRef<HTMLFormElement>(null);
    const lastEditTargetRef = useRef<HTMLButtonElement>(null);

    const handleEdit = (expenseId: number) => {
        setEditingId(expenseId);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId && formRef.current) {
            const formData = new FormData(formRef.current);

            setExpenses(
                expenses.map((exp) =>
                    exp.id === editingId
                        ? {
                            ...exp,
                            expense: formData.get("expense") as string,
                            method: formData.get("method") as string,
                            amount: parseFloat(formData.get("amount") as string) || 0,
                        }
                        : exp
                )
            );

            setEditingId(null);
            focusLastEditTarget();
        }
    };

    const focusLastEditTarget = () => {
        requestAnimationFrame(() => {
            lastEditTargetRef.current?.focus();
        });
    };


    const handleCancel = () => {
        setEditingId(null);
        focusLastEditTarget();
    };

    return (
        <MotionConfig transition={{ duration: 0.5, type: "spring", bounce: 0 }}>
            <div className="h-screen font-[Inter] w-full bg-white">
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-full max-w-2xl px-4">

                        <motion.div
                            // This layout is used to animate the header row
                            layout
                            animate={{
                                opacity: editingId !== null ? 0.3 : 1,
                                filter: editingId !== null ? "blur(0.5px)" : "blur(0px)",
                            }}
                            className="grid grid-cols-4 py-4 border-b border-gray-200"
                        >
                            <IconWrapper>
                                <FileText className="w-5 h-5" />
                                <span>Expense</span>
                            </IconWrapper>
                            <IconWrapper>
                                <Layers className="w-5 h-5" />
                                <span>Method</span>
                            </IconWrapper>
                            <IconWrapper>
                                <ArrowUpRight className="w-5 h-5" />
                                <span>Amount</span>
                            </IconWrapper>
                            <IconWrapper>

                            </IconWrapper>
                        </motion.div>


                        {expenses.map((expense) => (
                            <motion.div
                                // Just using layout prop squishes the row so we are using layout='position' to animate the row
                                layout='position'
                                key={expense.id}
                                className={clsx("grid grid-cols-4 gap-2 py-4 border-b border-gray-200")}
                            >

                                {editingId === expense.id ? (
                                    <motion.div className="col-span-full col-start-1">
                                        <FocusLock>
                                            <form onKeyDown={(e) => {
                                                if (e.key === "Escape") {
                                                    handleCancel();
                                                }
                                            }} ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                                                <FormInputField
                                                    icon={FileText}
                                                    label="Expense"
                                                    name="expense"
                                                    defaultValue={expense.expense}
                                                    layoutId={`${expense.id}-expense`}
                                                />

                                                <FormInputField
                                                    icon={Layers}
                                                    label="Method"
                                                    name="method"
                                                    defaultValue={expense.method}
                                                    layoutId={`${expense.id}-method`}
                                                />

                                                <FormInputField
                                                    icon={ArrowUpRight}
                                                    label="Amount"
                                                    name="amount"
                                                    defaultValue={expense.amount.toString()}
                                                    layoutId={`${expense.id}-amount`}

                                                />

                                                {/* Action buttons */}
                                                <div className="flex justify-end gap-2 mt-2">
                                                    <ActionButton
                                                        type="button"
                                                        onClick={handleCancel}
                                                        icon={X}
                                                        label="Cancel"
                                                    />
                                                    <ActionButton
                                                        type="submit"
                                                        icon={Check}
                                                        label="Done"
                                                        variant="primary"
                                                    />
                                                </div>
                                            </form>
                                        </FocusLock>
                                    </motion.div>
                                ) : (
                                    <div className="contents">
                                        <TableCell
                                            layoutId={`${expense.id}-expense`}
                                            className="text-gray-700 font-medium"
                                            isEditing={editingId !== null}
                                        >
                                            {expense.expense}
                                        </TableCell>

                                        <TableCell
                                            layoutId={`${expense.id}-method`}
                                            className="text-gray-500"
                                            isEditing={editingId !== null}
                                        >
                                            {expense.method}
                                        </TableCell>

                                        <TableCell
                                            layoutId={`${expense.id}-amount`}
                                            className="text-gray-700"
                                            isEditing={editingId !== null}
                                        >
                                            ${expense.amount}
                                        </TableCell>

                                        <motion.button
                                            layout
                                            // When form is closed, this button will gain latest ref since it will mount again
                                            ref={lastEditTargetRef}
                                            disabled={editingId !== null}
                                            className="text-gray-400 h-5 w-5 hover:text-gray-600 focus:text-gray-600 focus:outline-none disabled:text-gray-400 disabled:pointer-events-none"
                                            onClick={() => handleEdit(expense.id)}
                                            animate={{
                                                opacity: editingId !== null ? 0.3 : 1,
                                                filter: editingId !== null ? "blur(0.5px)" : "blur(0px)",
                                            }}
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </MotionConfig>
    );
};
