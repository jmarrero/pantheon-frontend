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
    console.log("Na " + moduleName)

  };
  handleTextInputChange2 = moduleDescription => {
    this.setState({ moduleDescription });
    console.log("Desc " + moduleDescription)
  };

  handleFileChange = selectorFiles => {
    this.setState({ moduleFile: selectorFiles[0] })
    console.log(selectorFiles);
  }

  saveModule = (postBody) => {
    console.log("My name is: "+ this.state.moduleName+ " and my desc is " + this.state.moduleDescription +" and my files are "+ this.state.moduleFile)
    // "jcr:title"=
    // name="jcr:description"  
    // name="asciidoc" type=file
    // name=":checkinNewVersionableNodes" value="true"/> -->
    // name="asciidoc@TypeHint" value="nt:file"/> -->
    // name="sling:resourceType" value="pantheon/modules"/>
    // name="jcr:primaryType" value="pant:module"/>
    // name="asciidoc/jcr:content/jcr:mimeType" value="text/x-asciidoc"/>

    const data = {
      "jcr:primaryType": 'pant:module',
      "jcr:title": this.state.moduleName,
      "jcr:description": this.state.moduleDescription,
      "asciidoc": this.state.moduleFile.name,
      "sling:resourceType": 'pantheon/modules',
      "pant:originalName": "??",
      "asciidoc@TypeHint": 'nt:file',
      "asciidoc/jcr:content/jcr:mimeType": "text/x-asciidoc"
    }

    fetch('http://localhost:8080/content/modules/', {
      method: 'post',
      body: JSON.stringify(data)
    }).then(response => {
      if (response.status == 201) {
        console.log(" Works " + response.status)
        this.setState({ redirect: true })
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

}
