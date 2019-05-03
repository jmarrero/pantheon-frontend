import React, { Component } from 'react';
import { Button, BackgroundImage, BackgroundImageSrc, TextInput } from '@patternfly/react-core';
import '@app/app.css';
import xs from '@assets/images/pfbg_576.jpg';
import xs2x from '@assets/images/pfbg_576@2x.jpg';
import sm from '@assets/images/pfbg_768.jpg';
import sm2x from '@assets/images/pfbg_768@2x.jpg';
import lg from '@assets/images/pfbg_1200.jpg';
import filter from '@assets/images/background-filter.svg';
import { Redirect } from 'react-router-dom'

const images = {
  [BackgroundImageSrc.xs]: xs,
  [BackgroundImageSrc.xs2x]: xs2x,
  [BackgroundImageSrc.sm]: sm,
  [BackgroundImageSrc.sm2x]: sm2x,
  [BackgroundImageSrc.lg]: lg,
  [BackgroundImageSrc.filter]: `${filter}#image_overlay`
};

export default class Module extends Component {
  public state = {
    moduleName: '',
    moduleDescription: '',
    moduleFile: File,
    redirect: false,
    login: false,
    failedPost: false
  };

  public render() {
    const { moduleName, moduleDescription } = this.state;
    return (
      <React.Fragment>
        <BackgroundImage src={images} />
        <div className="app-container">
          <div>
            <TextInput id="module-name" type="text" placeholder="Module Name" value={moduleName} onChange={this.handleTextInputChange1} />
            <TextInput id="module-description" type="text" placeholder="Module Description" value={moduleDescription} onChange={this.handleTextInputChange2} />
            <input id="input" className="input-file" color="#dddddd" type="file" onChange={(e) => this.handleFileChange(e.target.files)} />
            <div>
              {this.loginRedirect()}
              {this.renderRedirect()}
              <Button onClick={this.saveModule}>Save</Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleTextInputChange1 = moduleName => {
    this.setState({ moduleName });
    console.log("Name " + moduleName)

  };
  handleTextInputChange2 = moduleDescription => {
    this.setState({ moduleDescription });
    console.log("Desc " + moduleDescription)
  };

  handleFileChange = selectorFiles => {
    this.setState({ moduleFile: selectorFiles })
    console.log(selectorFiles);
  }

  saveModule = (postBody) => {
    console.log("My name is: " + this.state.moduleName + " and my desc is " + this.state.moduleDescription + " and my files are " + this.state.moduleFile)


    const hdrs = {
      'cache-control': 'no-cache',
      'Accept': 'application/json'
    }
    console.log("The file is: " + this.state.moduleFile)
    const blob = new Blob([this.state.moduleFile[0]])
    const formData = new FormData();
    formData.append("jcr:title", this.state.moduleName)
    formData.append("jcr:description", this.state.moduleDescription)
    formData.append("sling:resourceType", "pantheon/modules")
    formData.append("jcr:primaryType", 'pant:module')
    formData.append("asciidoc@TypeHint", 'nt:file')
    formData.append("asciidoc/jcr:content/jcr:mimeType", "text/x-asciidoc")
    formData.append("asciidoc", blob)

    fetch('http://localhost:8080/content/modules/' + this.state.moduleName, {
      method: 'post',
      headers: hdrs,
      body: formData
    }).then(response => {
      if (response.status == 201) {
        console.log(" Works " + response.status)
        this.setState({ redirect: true })
      } else  if (response.status == 500) {
        console.log(" Needs login " + response.status)
        this.setState({ login: true })
      } else {
        console.log(" Failed " + response.status)
        this.setState({ failedPost: true })
      }
    });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/' />
    } else {
      return ""
    }
  }

  loginRedirect = () => {
    if (this.state.login) {
      return <Redirect to='/system/sling/login.html' />
    } else {
      return ""
    }
  }
}
