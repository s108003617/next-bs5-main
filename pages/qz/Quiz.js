import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Quiz = () => {
  const [answers, setAnswers] = useState({})
  const questions = [
    {
      id: 1,
      question: '你最常使用的3C電器是什麼？',
      options: ['手機', '筆記型電腦', '平板電腦', '智能手錶'],
    },
    {
      id: 2,
      question: '你購買3C電器時最看重的是什麼？',
      options: ['價格', '品牌', '功能', '外觀設計'],
    },
    {
      id: 3,
      question: '你通常多久會更換一次手機？',
      options: ['每年', '每兩年', '每三年或更久', '只有在手機壞掉時才更換'],
    },
    {
      id: 4,
      question: '你喜歡使用哪種操作系統？',
      options: ['iOS', 'Android', 'Windows', 'macOS'],
    },
  ]

  const handleChange = (id, answer) => {
    setAnswers({ ...answers, [id]: answer })
  }

  const handleSubmit = async () => {
    const response = await fetch('/api/submit-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers),
    })
    const result = await response.json()
    showRecommendation(result.recommendation)
  }

  const showRecommendation = (recommendation) => {
    toast(`我們推薦您購買：${recommendation}`)
  }

  return (
    <div>
      {questions.map((q) => (
        <div key={q.id}>
          <p>{q.question}</p>
          {q.options.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name={`question-${q.id}`}
                value={option}
                onChange={() => handleChange(q.id, option)}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>提交</button>
      <ToastContainer />
    </div>
  )
}

export default Quiz
