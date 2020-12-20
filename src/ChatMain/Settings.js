import React from 'react'
import { GridForm, ToolbarDisplay } from '../Components'

class SettingsDisplay extends React.Component {
  constructor(data) {
    super()
    this.handleCancel = this.handleCancel.bind(this)
    this.handleApply = this.handleApply.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.formProps = [
      {
        title: 'UUID',
        prop: 'uuid',
        value: data.spiritClient.data.uuid,
        disabled: true
      },
      {
        title: 'Username',
        prop: 'username',
        value: data.spiritClient.data.username,
        disabled: true
      },
      {
        title: 'E-mail',
        prop: 'email',
        value: data.spiritClient.data.email,
      }
    ]
  }

  handleCancel() {
    this.props.spiritClient.saveSettings()
  }

  handleApply() {
    const params = {}
    
    for (const formProp of this.formProps) {
      params[formProp.prop] = formProp 
    }

    this.props.spiritClient.saveSettings(params)
  }

  handleOnChange(prop, value) {
    try {
      this.formProps.find(item => {return item.prop === prop}).value = value
    } catch (err) {
      /* do nothing */
    }
  }

  render() {
    return (
      <div className="settings">
        <div className="title">Settings</div>
        <GridForm
          formFields={this.formProps}
          onChange={this.handleOnChange}
        >
          <button title="Clear Logs" className="form-button cancel" onClick={this.handleCancel}>CLEAR LOGS</button>
        </GridForm>
        <ToolbarDisplay>
          <button className="form-button cancel" onClick={this.handleCancel}>CANCEL</button>
          <button className="form-button" onClick={this.handleApply}>APPLY</button>
        </ToolbarDisplay>
      </div>
    )
  }
}

export default SettingsDisplay
