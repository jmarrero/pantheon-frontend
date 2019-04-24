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
    redirect: false
  };
  public render() {
    return (
      <React.Fragment>
        <BackgroundImage src={images} />
        <div className="app-container">
          <div>
            <TextInput id="module-name" value={"Module Name"} />
            <TextInput id="module-description" value="Description" />
            <input type="file" />
            <div>
              {this.renderRedirect()}
              <Button onClick={this.setRedirect}>Save</Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  setRedirect = () => {
    this.setState({
      //save stuff here
      redirect: true
    })
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/' />
    } else {
      return ""
    }
  }


}
