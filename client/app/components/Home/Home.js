import React, { Component } from 'react';
import { FormGroup, FormControl, Button, Alert, Label, Table } from 'react-bootstrap';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      value: null,
      errorMessage: null,
      showInsights: false,
      statusCode: null,
      version: null,
      formCount: null,
      title: null,
      internalLinks: 0,
      externalLinks: 0,
      headingsLevels: []
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createHeadingLevelTable = this.createHeadingLevelTable.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();    
    console.log(`A URL was submitted: ${this.state.value}`);
    const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    if (!regex.test(this.state.value)) {
      this.setState({
        showError: true,
        errorMessage: 'Seems like your URL is in invalid format',
      })
    } else {
      this.setState({
        showError: false,
        errorMessage: null
      })
      fetch(`http://localhost:8000/fetch-html?pageURL=${this.state.value}`)
        .then((data) => {
          return data.json()
        })
        .then((response) => {
          if (response.data.statusCode !== 200) {
            this.setState({ 
              showError: true,
              errorMessage: response.message += response.data.statusCode ? ` Code: ${response.data.statusCode}` : null,
              showInsights: false
            })
          } else {
            this.setState({
              showInsights: true,
              statusCode: response.data.statusCode,
              version: response.data.version,
              title: response.data.title,
              internalLinks: response.data.anchorTagsCount.internalLinks,
              externalLinks: response.data.anchorTagsCount.externalLinks,
              headingsLevels: response.data.headingsLevels,
              formCount: response.data.formCount ? 'Yes' : 'No'
            })
          }
          
        })
        .catch((err) => {
          console.error(err)
          this.setState({ 
            showError: true,
            errorMessage: err.message,
            showInsights: false
          })
        })
    }
  }

  createHeadingLevelTable () {
    let table = []
    for (let i = 0; i < this.state.headingsLevels.length; i++) {
      const row = this.state.headingsLevels[i];
      table.push(<tr><td>{row.level}</td><td>{row.count}</td></tr>)
    }
    return table
  }  

  render() {
    return (
      <form className='web-analyzer'>
        <FormGroup controlId="formBasicText">
          <FormControl
            type="text"
            value={this.state.value}
            placeholder='Enter your Web URL'
            onChange={this.handleChange}
            require={true}
          />
          <Button type='submit' onClick={this.handleSubmit}>Submit</Button>
        </FormGroup>
        { this.state.showError && (
          <Alert bsStyle="warning">
            <strong>Oh Snap!</strong> {this.state.errorMessage}
          </Alert>
        )}
        { this.state.showInsights && (
          <div>
            Status Code <Label>{this.state.statusCode}</Label><br/>
            HTML Version <Label>{this.state.version}</Label><br/>
            Does contain Form? <Label>{this.state.formCount}</Label><br/>
            Page Title <Label>{this.state.title}</Label><br/>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Internal Links</th>
                  <th>External Links</th>
                  <th>Total Links Count</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.internalLinks}</td>
                  <td>{this.state.externalLinks}</td>
                  <td>{this.state.internalLinks + this.state.externalLinks}</td>
                </tr>
              </tbody>
            </Table>
            <br/>
            <Table striped bordered condensed hover>
              <thead>
                <tr>
                  <th>Heading Level</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {this.createHeadingLevelTable()}
              </tbody>
            </Table>
          </div>
        )}
      </form>
    )
  }
}

export default Home;
