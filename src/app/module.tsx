import React, { Component } from 'react';
import { TextInput, BackgroundImage, BackgroundImageSrc, Button } from '@patternfly/react-core';
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
    redirect: false,
    failedPost: false
  };
  public render() {
    return (
      <React.Fragment>
        <BackgroundImage src={images} />
        <div className="app-container">
          <div>
            <TextInput id="module-name" value={"Module Name"} />
            <TextInput id="module-description" value="Description" />
            <input className="input-file" color="#dddddd" type="file" />
            <div>
              {this.renderRedirect()}
              <Button onClick={this.saveModule}>Save</Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  saveModule(postBody){
   // "jcr:title"=
   // name="jcr:description"  
   // name="asciidoc" type=file
   // name=":checkinNewVersionableNodes" value="true"/> -->
   // name="asciidoc@TypeHint" value="nt:file"/> -->
   // name="sling:resourceType" value="pantheon/modules"/>
   // name="jcr:primaryType" value="pant:module"/>
   // name="asciidoc/jcr:content/jcr:mimeType" value="text/x-asciidoc"/>

 const   data = {"jcr:primaryType": 'pant:module',
                "jcr:title": "Joseph",
                "jcr:description": "Dance",
                "sling:resourceType": 'pantheon/modules',
                "pant:originalName": "",
                "asciidoc@TypeHint": 'nt:file'}

        fetch('http://localhost:8080/content/modules/', {
          method: 'post',
          body: JSON.stringify(data)
        }).then(response => {
          if (response.status == 201) {
            console.log(" Works "+response.status)
           this.setState({redirect: true})
          } else {
            console.log(" Failed "+response.status)
            this.setState({failedPost: true})
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
