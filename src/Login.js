import './App.css'
import './index.css'
import React from 'react'

class LoginDisplay extends React.Component {
  constructor(data) {
    super()
    this.data = data
    this.state = {
      signUp: !data.spiritClient.foundResourceFile,
      emailValid: data.spiritClient.validateEmail(),
      usernameValid: data.spiritClient.validateUsername(),
      passwordValid: data.spiritClient.validatePassword()
    }
    this.logonHandler = this.logonHandler.bind(this)
    this.updateFromPrompt = this.updateFromPrompt.bind(this)
  }

  logonHandler() {
    this.props.logonHandler({
      email: this.state.email,
      username: this.state.username,
      password: this.state.password
    })
  }
  
  updateFromPrompt(propName, value) {
    // this is cheating
    this.setState({[propName]: value})

    if (propName.startsWith('password')) {
      const password = propName === 'password' ? value : this.state.password
      const password_confirm = propName === 'password_confirm' ? value : this.state.password_confirm
      this.setState({passwordValid: this.props.spiritClient.validatePassword(password, password_confirm)})
    } else if (propName === 'username') {
      this.setState({usernameValid: this.props.spiritClient.validateUsername(value)})
    } else if (propName === 'email') {
      this.setState({emailValid: this.props.spiritClient.validateEmail(value)})
    }
  }

  showSignUp(signUp) {
    this.setState({
      signUp: signUp
    })
  }

  componentDidMount() {
    this.props.spiritClient.on('show-sign-up', this.showSignUp, this)
  }

  componentWillUnmount() {
    this.props.spiritClient.un('show-sign-up', this.showSignUp)
  }

  renderLogin() {
    return (
      <div className="form-panel">
        <PromptsDisplay handleChange={this.updateFromPrompt} label="Username" propName="username" type="text"></PromptsDisplay>
        <PromptsDisplay handleChange={this.updateFromPrompt} label="Password" propName="password" type="password"></PromptsDisplay>
        <button className="form-button login-button" onClick={this.logonHandler}>LAUNCH</button>
      </div>
    )
  }


  renderSignUp() {
    const allValid = !(this.state.passwordValid || []).length &&
                     !(this.state.usernameValid || []).length &&
                     !(this.state.emailValid || []).length
    const className = `form-button login-button ${allValid ? '' : 'disabled'}`
    return (
      <div className="form-panel">
        <PromptsDisplay 
          handleChange={this.updateFromPrompt} 
          label="Email"
          propName="email"
          type="email"
          invalidReasons={this.state.emailValid}></PromptsDisplay>
        <PromptsDisplay 
          handleChange={this.updateFromPrompt}
          label="Username"
          propName="username" 
          type="text"
          invalidReasons={this.state.usernameValid}></PromptsDisplay>
        <PromptsDisplay handleChange={this.updateFromPrompt} label="Password" propName="password" type="password"></PromptsDisplay>
        <PromptsDisplay 
          handleChange={this.updateFromPrompt} 
          label="Confirm Password" 
          propName="password_confirm" 
          type="password" 
          invalidReasons={this.state.passwordValid}></PromptsDisplay>
        <button className={className} onClick={this.logonHandler}>LAUNCH</button>
      </div>
    )
  }

  render() {
    return (
      <div id="login-container" className="flex-center">
        {this.state.signUp ? this.renderSignUp() : this.renderLogin() }
      </div>
    )
  }
}

class PromptsDisplay extends React.Component {
  constructor() {
    super()
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    if (this.props.propName) {
      this.props.handleChange(this.props.propName, e.target.value)
    }
  }

  render() {
    return (
      <div>
        <dl className="form-prompt">
          <dt>
            <label className="form-label">{this.props.label}</label>
          </dt>
          <dt>
            <input className="form-input" type={this.props.type} onChange={this.handleChange}></input>
          </dt>
          {!!(this.props.invalidReasons || []).length &&
            <dd className="invalid-reasons">
            {this.props.invalidReasons.map((reason, index) => {
              return <p key={index}>{reason}</p>
            })
            }
            </dd>
          }
        </dl>
      </div>
    )
  }
}

export default LoginDisplay
