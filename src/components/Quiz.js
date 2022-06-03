import React, { useState } from 'react';
import CountdownTimer from './CountdownTimer';
import Modal from './Modal';

const Quiz = ({ questions, amount, setIsFirst }) => {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [finalResult, setFinalResult] = useState({});
  const [finalAnswers, setFinalAnswers] = useState({});
  const [isShowResult, setIsShowResult] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { question, correct_answer, incorrect_answers } = questions[index];

  if (!finalAnswers[index]) {
    const tempIndex = Math.floor(Math.random() * 4);
    let answers = [...incorrect_answers];
    if (answers.length === 1) {
      // TH Dap an la true or false
      answers.push(correct_answer);
    } else {
      // TH co 4 dap an
      if (tempIndex === 3) {
        answers.push(correct_answer);
      } else {
        answers.push(answers[tempIndex]);
        answers[tempIndex] = correct_answer;
      }
    }
    setFinalAnswers({ ...finalAnswers, [index]: answers });
  }

  const previousQuestion = () => {
    if (index === 0) return;
    setIndex(index - 1);
  };

  const nextQuestion = () => {
    if (index === amount) return;
    setIndex(index + 1);
  };

  const checkAnswer = (answer) => {
    if (isShowResult) {
      return;
    }
    setFinalResult({
      ...finalResult,
      [index]: { my_answer: answer, correct_answer: correct_answer },
    });
    // nextQuestion();
  };

  const submit = () => {
    if (isShowResult) {
      setIsFirst(true);
      return;
    }
    setIndex(0);
    setIsModalOpen(true);
    let arr = Array.from(Array(amount).keys());
    let result = {};
    let numOfCorrect = correct;

    // set object of final result
    arr.forEach((el) => {
      if (!finalResult[el]) {
        result[el] = {
          my_answer: undefined,
          correct_answer: questions[el]['correct_answer'],
        };
      }
    });

    setFinalResult({
      ...finalResult,
      ...result,
    });

    // Count num of correct answer
    Object.values({ ...finalResult, ...result }).forEach((el) => {
      if (el['my_answer'] === el['correct_answer']) {
        numOfCorrect += 1;
      }
    });
    setCorrect(numOfCorrect);
    setIsShowResult(true);
  };

  console.log(finalResult);

  return (
    <main>
      <Modal
        result={correct === 0 ? 0 : correct / amount}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setIsFirst={setIsFirst}
      />
      <section className='quiz'>
        <div className='quiz-title'>
          <span className='tag is-primary is-large'>
            Correct answers: {correct}/{amount}
          </span>
          {!isShowResult && <CountdownTimer submit={submit} />}
          {isShowResult && (
            <span className='tag is-primary is-large'>
              {finalResult[index]['my_answer'] ===
              finalResult[index]['correct_answer']
                ? '1/1 point'
                : '0/1 point'}
            </span>
          )}
        </div>
        <article className='container'>
          <h3
            className='title is-3 mt-6'
            style={{ textAlign: 'center' }}
            dangerouslySetInnerHTML={{ __html: question }}
          />
          <div style={{ textAlign: 'center' }}>
            {!isShowResult &&
              finalAnswers[index]?.map((answer, id) => {
                return (
                  <button
                    style={{ width: '75%' }}
                    key={id}
                    //   className='button is-info mb-4'
                    className={`${
                      finalResult[index]
                        ? finalResult[index]['my_answer'] === answer
                          ? 'button is-warning mb-4'
                          : 'button is-info mb-4'
                        : 'button is-info mb-4'
                    }`}
                    dangerouslySetInnerHTML={{ __html: answer }}
                    onClick={() => checkAnswer(answer)}
                  />
                );
              })}
            {isShowResult &&
              finalAnswers[index]?.map((answer, id) => {
                const myAnswer = finalResult[index]['my_answer'];
                const correctAnswer = finalResult[index]['correct_answer'];
                if (!myAnswer) {
                  return (
                    <button
                      style={{ width: '75%' }}
                      key={id}
                      className={`${
                        correctAnswer === answer
                          ? 'button is-warning mb-4'
                          : 'button is-info mb-4'
                      }`}
                      dangerouslySetInnerHTML={{ __html: answer }}
                      onClick={() => checkAnswer(answer)}
                    />
                  );
                }

                if (
                  (myAnswer === answer && myAnswer === correctAnswer) ||
                  (answer === correctAnswer && answer !== myAnswer)
                ) {
                  return (
                    <button
                      style={{ width: '75%' }}
                      key={id}
                      className='button is-success mb-4'
                      dangerouslySetInnerHTML={{ __html: answer }}
                      onClick={() => checkAnswer(answer)}
                    />
                  );
                }
                if (answer !== myAnswer && answer !== correctAnswer) {
                  return (
                    <button
                      style={{ width: '75%' }}
                      key={id}
                      className='button is-info mb-4'
                      dangerouslySetInnerHTML={{ __html: answer }}
                      onClick={() => checkAnswer(answer)}
                    />
                  );
                }
                return (
                  <button
                    style={{ width: '75%' }}
                    key={id}
                    className='button is-danger mb-4'
                    dangerouslySetInnerHTML={{ __html: answer }}
                    onClick={() => checkAnswer(answer)}
                  />
                );
              })}
          </div>
          <div
            className='mt-6'
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <button
              className='button is-info is-outlined'
              onClick={previousQuestion}
            >
              Previous question
            </button>
            <button className='button is-info' onClick={submit}>
              {!isShowResult ? 'Submit' : 'Play again'}
            </button>
            <button
              className='button is-info is-outlined'
              onClick={nextQuestion}
            >
              Next question
            </button>
          </div>
          <div style={{ textAlign: 'right' }} className='mt-4'>
            <span className='tag is-info'>
              {`${index + 1}/${questions.length}`}
            </span>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Quiz;
