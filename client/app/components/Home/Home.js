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
      containForm: null,
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
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();    
    console.log(`A URL was submitted: ${this.state.value}`);
    const regex = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
    if (!regex.test(this.state.value) && false) {
      this.setState({
        showError: true,
        errorMessage: 'Seems like your URL is in invalid format'
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
          this.setState({
            showInsights: true,
            statusCode: response.data.statusCode,
            version: response.data.version,
            title: response.data.title,
            internalLinks: response.data.anchorTagsCount.internalLinks,
            externalLinks: response.data.anchorTagsCount.externalLinks,
            headingsLevels: response.data.headingsLevels
          })
        })
        .catch((err) => {
          console.error(err)
          this.setState({ 
            showError: true,
            errorMessage: err.message,
            showInsights: false,
            statusCode: err.code
          })
        })
    }
  }

  createHeadingLevelTable () {
    let table = []

    // Outer loop to create parent
    for (let i = 0; i < this.state.headingsLevels.length; i++) {
      const row = this.state.headingsLevels[i];
      table.push(<tr><td>{row.level}</td><td>{row.count}</td></tr>)
    }
    return table
  }  

  render() {
    return (
      <form>
        <FormGroup
          controlId="formBasicText"
        >
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
            Does contain Form? <Label>{this.state.containForm}</Label><br/>
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
