import React from "react";
import { handleResetPassword } from "../userPageApis"; // path apne hisab se

const ResetPasswordModal = ({
    isOpen,
    setIsResetModalOpen,
    resetPassword,
    setResetPassword,
    selectedUserId,
    showToast,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b bg-purple-50 flex justify-between items-center">
                    <h2 className="font-bold text-gray-800">Reset Password</h2>

                    <button onClick={() => setIsResetModalOpen(false)}>✕</button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <input
                        type="password"
                        autoComplete="current-password"
                        style={{ display: "none" }}
                    />

                    <input
                        type="password"
                        name="new-password"
                        autoComplete="new-password"
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    {/* <input
                        autoComplete="off"
                        type="password"
                        placeholder="Enter new password"
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    /> */}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t flex gap-3">
                    <button
                        onClick={() => setIsResetModalOpen(false)}
                        className="flex-1 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() =>
                            handleResetPassword(
                                selectedUserId,
                                resetPassword,
                                setIsResetModalOpen,
                                setResetPassword,
                                showToast
                            )
                        }
                        className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordModal;