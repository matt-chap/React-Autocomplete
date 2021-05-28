import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
  TODO: enhancements to be made
  1) clicking outside the dropdown make it disapear
*/

export class Autocomplete extends Component {
  static propTypes = {
    // This needs to be an array of objects
    items: PropTypes.instanceOf(Array).isRequired,

    // This needs to be the object property you want to use as the key
    keyProp: PropTypes.instanceOf(String).isRequired,

    // This needs to be the object property you want to use as the label 
    labelProp: PropTypes.instanceOf(String).isRequired,
  }

  state = {
    activeOption: 0,
    filteredItems: [],
    showOptions: false,
    userInput: ''
  }

  onChange = (e) => {
    const { items, keyProp, labelProp } = this.props
    const userInput = e.currentTarget.value

    const filteredItems = items.filter((item) => item[labelProp].toLowerCase().indexOf(userInput.toLowerCase()) > -1)

    this.setState({
      activeOption: 0,
      filteredItems,
      showOptions: true,
      userInput: e.currentTarget.value
    })
  }

  /* 
    Adds dropdown item to the input text
    And also removes the dropdown list
  */
  onItemClick = (e) => {
    this.setState({
      activeOption: 0,
      filteredItems: [],
      showOptions: false,
      userInput: e.currentTarget.innerText
    })
  }

  /* 
    Adds all options to the dropdown list
    Clears out currently selected option
  */
  onInputClick = (e) => {
    const { showOptions } = this.state
    
    const { items, keyProp, labelProp } = this.props
    this.setState({
      activeOption: 0,
      filteredItems: items,
      showOptions: !showOptions,
      userInput: ''
    })
  }

  onKeyDown = (e) => {
    const { items, keyProp, labelProp } = this.props
    const { activeOption, filteredItems } = this.state

    if (e.keyCode === 13) {
      //if the user hits enter return the first items label
      this.setState({
        activeOption: 0,
        showOptions: false,
        userInput: filteredItems[activeOption][labelProp]
      })
    } else if (e.keyCode === 38) {
      if (activeOption === 0) {
        return
      }
      this.setState({ activeOption: activeOption - 1 })
    } else if (e.keyCode === 40) {
      if (activeOption === filteredItems.length - 1) {
        console.log(activeOption)
        return
      }
      this.setState({ activeOption: activeOption + 1 });
    }
  }

  render() {
    const { items, keyProp, labelProp } = this.props
    const {
      onChange,
      onInputClick,
      onInputBlur,
      onItemClick,
      onKeyDown,
      state: { activeOption, filteredItems, showOptions, userInput }
    } = this
    let optionList;
    if (showOptions && (userInput || filteredItems.length)) {
      if (filteredItems.length) {
        optionList = (
          <ul className="options">
            {filteredItems.map((option, index) => {
              let className;
              if (index === activeOption) {
                className = 'option-active';
              }
              return (
                <li className={className} key={option[keyProp]} onClick={onItemClick}>
                  {option[labelProp]}
                </li>
              );
            })}
          </ul>
        );
      } else {
        optionList = (
          <div className="no-options">
            <em>No Option!</em>
          </div>
        );
      }
    }
    return (
      <React.Fragment>
        <div className="search">
          <input
            type="text"
            className="search-box"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={userInput}
            onClick={onInputClick}
          />
          <input type="submit" value="" onClick={onInputClick} className="search-btn" />
        </div>
        {optionList}
      </React.Fragment>
    )
  }
}

export default Autocomplete;
