import React from 'react'
import ErrorBox from '~/components/ErrorBox'
import PropTypes from 'prop-types'

import Button from '~/components/new/button'

import CrossIcon from '~/components/icons/cross'
import CheckIcon from '~/components/icons/check'

const styles = {
  icon: {
    display: 'inline-block',
    lineHeight: 1,
    verticalAlign: 'middle',
    marginLeft: '.25rem'
  }
}

const Area = (props) => (
  <div>
    {props.children}
    <style jsx>{`
      div {
        margin-top: 2rem;
        margin-bottom: 4rem;
        counter-reset: answer-list;
      }
    `}</style>
  </div>
)

class Answer extends React.Component {
  render () {
    const { answer, onChange, selected, readOnly, symbol } = this.props

    return (
      <label className={'f5' + (readOnly ? ' disabled' : '')}>
        <input
          type='radio'
          value={answer}
          name='answer'
          onChange={(e) => onChange(e)}
          disabled={readOnly}
          defaultChecked={selected}
        />
        <span>{answer} {symbol}</span>
        <style jsx>{`
          input {
            display: none;
          }

          input:checked  + span {
            color: #111;
            border-color: #111;
            box-shadow: 0 0 0 3px #c1c1c1;
            font-weight: 600;
          }

          label {
            display: block;
            margin: .5rem 0;
            ${readOnly ? '' : 'cursor: pointer;'}
          }

          label span:before {
            counter-increment: answer-list;
            content: counter(answer-list, upper-alpha) ". ";
            display: inline-block;
            width: 1.5rem;
          }

          span {
            color: #666;
            display: block;
            padding: .5rem 1rem;
            border-radius: 7px;
            border: 1px solid #666;
            transition: box-shadow .2s ease;
          }

          .disabled input  + span {
            border-color: #eaeaea;
          }

          .disabled input:checked  + span {
            color: unset;
            font-weight: 500;
            background: white;
            border-color: #111;
          }
        `}</style>
      </label>
    )
  }
}

class AnswerBox extends React.Component {
  constructor (...args) {
    super(...args)
    this.state = { answer: null }
  }

  chooseAnswer (e) {
    this.setState({
      answer: e.target.value
    })
  }

  handleSubmit () {
    const { answer } = this.state
    const { onSubmit } = this.props

    if (onSubmit) onSubmit(answer)
  }

  renderPrompt () {
    const { step, loading } = this.props

    return (
      <Area>
        {step.answers.map((answer) => (
          <Answer
            key={answer}
            answer={answer}
            onChange={(e) => this.chooseAnswer(e)}
          />
        ))}
        <div>
          <Button
            onClick={() => this.handleSubmit()} 
            color='#252525'
            shadowColor='rgba(0, 0, 0, 0.2)'
            disabled={loading}
            invert
          >
            Submit
          </Button>
          <style jsx>{`
            div {
              margin: 2rem 0 4rem;
            }
          `}</style>
        </div>
      </Area>
    )
  }

  renderStatus () {
    const { step, loading } = this.props
    const isCorrect = step.givenAnswer === step.correctAnswer

    const getSymbol = (answer) => {
      if (isCorrect) {
        if (answer !== step.givenAnswer) return (<span></span>)
        if (answer === step.correctAnswer) return (<span style={styles.icon}><CheckIcon color="#19ce56"/></span>)
      }
      if (answer === step.correctAnswer) return (<span style={styles.icon}><CheckIcon color="#19ce56"/></span>)
      if (answer !== step.givenAnswer) return (<span></span>)
      return (<span style={styles.icon}><CrossIcon color="red"/></span>)
    }

    return (
      <Area>
        {loading ? <p>Loading...</p> : null}
        {step.answers.map((answer) => (
          <Answer
            key={answer}
            answer={answer}
            symbol={getSymbol(answer)}
            selected={answer === step.givenAnswer}
            readOnly
          />
        ))}
      </Area>
    )
  }

  render () {
    const { step, error } = this.props

    if (error) return (<ErrorBox error={error}/>)

    if (!step.givenAnswer) return this.renderPrompt()
    return this.renderStatus()
  }
}

AnswerBox.propTypes = {
  error: PropTypes.object,
  step: PropTypes.object,
  courseId: PropTypes.string,
  lessonId: PropTypes.string
}

AnswerBox.fragment = (c) => c.createFragment(`
  fragment on Step {
    id,
    answers,
    correctAnswer,
    givenAnswer
  }
`)

export default AnswerBox
