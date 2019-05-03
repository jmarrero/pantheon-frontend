import React, { Component } from 'react';
import { TextInput, Label, BackgroundImage, BackgroundImageSrc } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import '@app/app.css';
import xs from '@assets/images/pfbg_576.jpg';
import xs2x from '@assets/images/pfbg_576@2x.jpg';
import sm from '@assets/images/pfbg_768.jpg';
import sm2x from '@assets/images/pfbg_768@2x.jpg';
import lg from '@assets/images/pfbg_1200.jpg';
import filter from '@assets/images/background-filter.svg';

const images = {
  [BackgroundImageSrc.xs]: xs,
  [BackgroundImageSrc.xs2x]: xs2x,
  [BackgroundImageSrc.sm]: sm,
  [BackgroundImageSrc.sm2x]: sm2x,
  [BackgroundImageSrc.lg]: lg,
  [BackgroundImageSrc.filter]: `${filter}#image_overlay`
};

export default class Index extends Component {
  public state = {
    redirect: false,
    redirectLocation: '',
    input: '',
    columns: ['Name', 'Description', 'Source Type', 'Source Name', 'Upload Time'],
    data: [{"jcr:created": '', "name": "red_hat","jcr:title": "Search is case sensitive. Enter '*' for all modules.", "jcr:description": "", "sling:resourceType": "", "pant:transientSource":""}]
  };
  public render() {
    const { columns, input } = this.state;
    return (
      <React.Fragment>
        <BackgroundImage src={images} />
        <div className="app-container">
          <div>
            <Label>Search:
           <TextInput value={input} id="search" onChange={() => this.getRows(event)} type="text" placeholder="*" />
            </Label>
            <Table aria-label="table-header" rows={[]} cells={columns} >
              <TableHeader />
            </Table>
            {this.renderPreview()}
            {this.state.data.map(data => (
              <Table id="table-rows" aria-label="table-data" key={data.name} rows={[[data["jcr:title"], data["jcr:description"], data["sling:resourceType"], data["pant:transientSource"], data["jcr:created"].toString()]]} cells={columns} >
                <TableBody onRowClick={() => this.setPreview(data.name)} />
              </Table>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }

  private getRows = (event) => {
    console.log("what do I see? " + event.target.value)
    this.setState({
      input: event.target.value
    }, () => {
      console.log("Now I get the expected value down " + this.state.input)
      var backend = "http://localhost:8080/modules.json?search="
      if (this.state.input != null && this.state.input != "" && this.state.input != "*") {
        backend = backend + this.state.input
        console.log(backend)
      }
      fetch(backend)
        .then(response => response.json())
        .then(responseJSON => this.setState({ data: responseJSON }))
        .then(() => console.log("JSON string is " + JSON.stringify(this.state.data)))
    })
  };


  private setPreview(name: string) {
    console.log("what do I when you click ? " + name)
    this.setState({
      redirect: true,
      redirectLocation: name
    }
    )
  };

  renderPreview = () => {
    if (this.state.redirect) {
      console.log(this.state.redirect)
      return window.location.assign("http://localhost:8080/modules/" + this.state.redirectLocation + ".preview");
    } else {
      console.log(this.state.redirect)
      return ""
    }
  };

}