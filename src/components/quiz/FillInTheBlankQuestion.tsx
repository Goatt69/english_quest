import React from "react";

interface FillInTheBlankQuestionProps {
  question: { text: string; [key: string]: any }; // Cải thiện type cho an toàn
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string) => void;
}

export default function FillInTheBlankQuestion({
  question,
  selectedAnswer,
  setSelectedAnswer,
}: FillInTheBlankQuestionProps) {
  return (
    <div>
      <p>{question?.text || "Lỗi: Không tải được câu hỏi"}</p>
      {!question?.text && (
        <p className="text-red-500">Dữ liệu câu hỏi không đầy đủ</p>
      )}
      <input
        type="text"
        value={selectedAnswer || ""}
        onChange={(e) => setSelectedAnswer(e.target.value)}
        placeholder="Nhập câu trả lời của bạn"
      />
    </div>
  );
}