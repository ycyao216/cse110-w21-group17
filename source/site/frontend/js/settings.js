function _class(name){
  return document.getElementsByClassName(name);
}
 
let tabPanes = _class("tab-header")[0].getElementsByTagName("div");
 
for(let i=0;i<tabPanes.length;i++){
  tabPanes[i].addEventListener("click",function(){
    _class("tab-header")[0].getElementsByClassName("active")[0].classList.remove("active");
    tabPanes[i].classList.add("active");
    
    _class("tab-indicator")[0].style.top = `calc(80px + ${i*50}px)`;
    
    _class("tab-content")[0].getElementsByClassName("active")[0].classList.remove("active");
    _class("tab-content")[0].getElementsByClassName("tabcontent")[i].classList.add("active");
    
  });
}



(function() {
  'use strict';

  function ctrls() {
      var _this = this;

      this.counter = 0;
      this.els = {
          decrement: document.querySelector('.ctrl-button-decrement'),
          counter: {
              container: document.querySelector('.ctrl-counter'),
              num: document.querySelector('.ctrl-counter-num'),
              input: document.querySelector('.ctrl-counter-input')
          },
          increment: document.querySelector('.ctrl-button-increment')
      };

      this.decrement = function() {
          var counter = _this.getCounter();
          var nextCounter = (_this.counter > 0) ? --counter: counter;
          _this.setCounter(nextCounter);
      };

      this.increment = function() {
          var counter = _this.getCounter();
          var nextCounter = (counter < 9999999999) ? ++counter: counter;
          _this.setCounter(nextCounter);
      };

      this.getCounter = function() {
          return _this.counter;
      };

      this.setCounter = function(nextCounter) {
          _this.counter = nextCounter;
      };

      this.debounce = function(callback) {
          setTimeout(callback, 100);
      };

      this.render = function(hideClassName, visibleClassName) {
          _this.els.counter.num.classList.add(hideClassName);

          setTimeout(function() {
              _this.els.counter.num.innerText = _this.getCounter();
              _this.els.counter.input.value = _this.getCounter();
              _this.els.counter.num.classList.add(visibleClassName);
          },
          100);

          setTimeout(function() {
              _this.els.counter.num.classList.remove(hideClassName);
              _this.els.counter.num.classList.remove(visibleClassName);
          },
          200);
      };

      this.ready = function() {
          _this.els.decrement.addEventListener('click',
          function() {
              _this.debounce(function() {
                  _this.decrement();
                  _this.render('is-decrement-hide', 'is-decrement-visible');
              });
          });

          _this.els.increment.addEventListener('click',
          function() {
              _this.debounce(function() {
                  _this.increment();
                  _this.render('is-increment-hide', 'is-increment-visible');
              });
          });

          _this.els.counter.input.addEventListener('input',
          function(e) {
              var parseValue = parseInt(e.target.value);
              if (!isNaN(parseValue) && parseValue >= 0) {
                  _this.setCounter(parseValue);
                  _this.render();
              }
          });

          _this.els.counter.input.addEventListener('focus',
          function(e) {
              _this.els.counter.container.classList.add('is-input');
          });

          _this.els.counter.input.addEventListener('blur',
          function(e) {
              _this.els.counter.container.classList.remove('is-input');
              _this.render();
          });
      };
  };

  // init
  var controls = new ctrls();
  document.addEventListener('DOMContentLoaded', controls.ready);
})();


// iOSTimePicker start

class iOSTimePicker {
  constructor(elem, options) {
    this.parent = elem.parentNode;
    
    this.options = {
      defaultTime: null,
      onInit: null,
      onChange: null,
      ...options
    };
    this.value = this._initValue();
    this.init = true;
    this.currentType = null;
    this.input = elem;
    this.minuteSegment = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
    this.tempMinuteSegment = [];
    this.container = document.createElement('div');
    this.text = document.createElement('div');
    this.scroller = document.createElement('div');
    this.hourSlider = document.createElement('div');
    this.minSlider = document.createElement('div');
    this.hourBox = document.createElement('div');
    this.minuteBox = document.createElement('div');
    this.scrollerTimeout = null;
    this.canEdit = false;
    this.tempValue = '';
    
    this._initContainer(elem);
    
    this.input.addEventListener('focus', e => this._inputFocus(e))
    this.input.addEventListener('blur', e => this._inputBlur(e))
    this.input.addEventListener('keydown', e => this._insert(e, this))
  }
  
  // use current time to set value
  _initValue = () => {
    let minute = '00';
    let hour = '00';
    
    if(!this.options.defaultTime) {
      let current = new Date();
      let roundMin = Math.ceil(current.getMinutes() / 5)* 5;
      minute = roundMin === 60 ? '00' : roundMin < 10 ? '0' + roundMin : roundMin;
      hour = roundMin === 60 ? current.getHours() + 1 : current.getHours();
    } else {
      let time = this.options.defaultTime.split(':');
      hour = time[0];
      minute = time[1];
    }
    
    return { hour, minute };
  }
 
    // Create TimePicker HTML structor
  _initContainer = (elem) => {
    // set text for input keydown
    this._createText();
    
    // set scroller
    this._createSlider(this.minuteSegment);
    
    this.container.classList.add('ios-time-picker-container');

    if(this.input.classList.contains('is-dark')) {
      this.container.classList.add('is-dark');
    }

    this.container.appendChild(this.input);
    this.container.appendChild(this.text);
    this.container.appendChild(this.scroller);
    
    this.input.value = `${this.value.hour}${this.value.minute}`

    this.parent.appendChild(this.container);
    
    this._setCurrentSlide();
    this.hourSlider.addEventListener('scroll', e => this._scrollDetect(e, 'hour'));
    this.minSlider.addEventListener('scroll', e => this._scrollDetect(e, 'minute'));
  }
  
  // set hour & minute display
  _createText = () => {
    this.text.classList.add('ios-time-picker-text');
    
    this.hourBox.classList.add('ios-time-picker-hour');
    this.minuteBox.classList.add('ios-time-picker-minute');
    
    this.text.appendChild(this.hourBox);
    this.text.appendChild(this.minuteBox);
  
    this._setBoxText()
  }
  
  _setBoxText = () => {
    this.hourBox.innerText = this.value.hour;
    this.minuteBox.innerText = this.value.minute; 
  }
  
  // focus state, could insert & scroll number
  _inputFocus = (e) => {
    e.preventDefault();
    
    this.canEdit = true;
    this.container.classList.add('is-focus');
  }
  
  _inputBlur = (e) => {
    e.preventDefault();
    // remove is-focus class name, and set canEdit to false
    this.canEdit = false;
    this.container.classList.remove('is-focus');
  }
  
  _timeLimit = (time, limit) => {
    // if time bigger than limit, set the tens digit to 0
    if(time.length === 2 && Number(time) > limit) {
      return  '0' + time[1];
    } 
    
    return time;
  }
  
  // insert new time
  _insert = (e, $this) => {
    // not number & not focus status will return
    if (!this.canEdit || e.charCode > 31 && (e.charCode != 46 && (e.charCode < 48 || e.charCode > 57))) return;
    
    this.container.classList.add('is-inserting');
    let nodes = $this.text.childNodes;

    this.tempValue = (this.tempValue+ e.key).length > 4 ? e.key :  this.tempValue + e.key;

    // empty hours & minutes
    nodes.forEach(elem => {
      elem.innerText = '';
    });

    if (this.tempValue.length < 3) {
      nodes[1].innerText = this._timeLimit(this.tempValue, 59);
    } else {
      let hr = this.tempValue.substring(0, this.tempValue.length - 2);
      let min = this.tempValue.substring(this.tempValue.length - 2, this.tempValue.length);

      nodes[0].innerText = this._timeLimit(hr, 23);
      nodes[1].innerText = this._timeLimit(min, 59);
    }
    
    if (this.tempValue.length === 4) {
      let hr = this.tempValue.substring(0, 2);
      let min = this.tempValue.substring(2, 4);
      this.value = { 
         hour: this._timeLimit(hr, 23),
         minute: this._timeLimit(min, 59),
      };
      
      let minute = Number(this.value.minute);
      if(minute % 5 > 0) {
        this.tempMinuteSegment = [...this.minuteSegment];
        this.tempMinuteSegment.splice(Math.ceil(minute / 5), 0, this.value.minute);
        this._createSlider(this.tempMinuteSegment);
      }

      this.container.classList.remove('is-inserting');
      this._setCurrentSlide();
      this._setValue();
    }
  }

  // Create slider
  _createSlider = (minArray) => {
    this.scroller.innerHTML = '';
    this.hourSlider.innerHTML = '';
    this.minSlider.innerHTML = '';
    
    this.hourSlider.className = 'ios-time-picker-slider is-hour';
    this.minSlider.className = 'ios-time-picker-slider is-minute';
    let hourWrapper = document.createElement('div');
    let minuteWrapper = document.createElement('div');
    hourWrapper.classList.add('ios-time-picker-slider-track');
    minuteWrapper.classList.add('ios-time-picker-slider-track');
    // render hours slide
    for(let i = 0; i < 24; i++) {
      let hourSlide = document.createElement('div');
      let hour = i < 10 ? `0${i}` : i;
      hourSlide.classList.add('ios-time-picker-slide');
      hourSlide.dataset.hour = hourSlide.innerText = hour;

      hourWrapper.appendChild(hourSlide);
    }

    // render minutes slide
    for(let i = 0; i < minArray.length; i++) {
      let minSlide = document.createElement('div');
      minSlide.classList.add('ios-time-picker-slide');
      minSlide.innerText = minSlide.dataset.minute = minArray[i];

      minuteWrapper.appendChild(minSlide);
    }
    
    this.hourSlider.appendChild(hourWrapper);
    this.minSlider.appendChild(minuteWrapper);
    this.scroller.appendChild(this.hourSlider);
    this.scroller.appendChild(this.minSlider);
    this.scroller.classList.add('ios-time-picker-scroller');
  }
  
  _setCurrentSlide = () => {
    let currentHour = document.querySelector(`[data-hour="${this.value.hour}"]`);
    let currentMinute = document.querySelector(`[data-minute="${this.value.minute}"]`);
    
    this.hourSlider.scrollTop = currentHour.offsetTop - 9;
    this.minSlider.scrollTop = currentMinute.offsetTop - 9;
  }
  
  _scrollDetect = (e, type) => {
    e.preventDefault();
    let target = e.target;
    
    if(type === 'hour') {
      this.minSlider.classList.add('is-disabled');
    } else {
      this.hourSlider.classList.add('is-disabled');
    }
    
    clearTimeout(this.scrollerTimeout);
    
    this.scrollerTimeout = setTimeout(() => {
      clearTimeout(this.scrollerTimeout);
      this._selectTimeSegment(target, type);
    }, 800);
  }
  
  _selectTimeSegment = (elem, type) => {
    let selector = this.container.querySelectorAll(`.ios-time-picker-slide[data-${type}]`);
    let count = elem.scrollTop / 30;
    let indexMin = Math.floor(count);
    let indexMax = Math.ceil(count);
    let index = indexMax - (count) < count - Math.floor(count) ? indexMax : indexMin;
    let segment = index >= selector.length ? selector.length - 1 : index;
    
    elem.scrollTo({
      left: 0, top: segment * 30, behavior: 'smooth'
    });
    
    if(this.value[type] !== selector[segment].innerText) {
      this.value = {
        ...this.value,
        [type]: selector[segment].innerText
      }

      this._setValue();
      this._setBoxText();
    }

    if (this.init) this.init = false;
    
    if (this.minSlider.classList.contains('is-disabled')) {
      this.minSlider.classList.remove('is-disabled');
    }
    if (this.hourSlider.classList.contains('is-disabled')) {
      this.hourSlider.classList.remove('is-disabled');
    }
    
    this.currentType = null;
  }
  
  _setValue = () => {
    this.input.value = `${this.value.hour}${this.value.minute}`;
    
    if(this.options.onInit && this.init) 
      this.options.onInit(this.input, this.input.name, this.value);
    
    if(this.options.onChange && !this.init) 
      this.options.onChange(this.input, this.input.name, this.value);
  }
}

let TimePicker = [];

document.querySelectorAll('.ios-time-picker').forEach((elem, i) => {
  TimePicker.push(
    new iOSTimePicker(elem, {
      defaultTime: i === 0 ? '12:30' : null,
      onChange: (input, name, value) => {
        console.info(`you select ${value.hour}:${value.minute} in input[name=${name}]`)
        // alert(`You`)
      },
      onInit: (input, name, value) => {
        console.info(`${value.hour}:${value.minute} in input[name=${name}]`)
        // alert(`You`)
      }
    })
  )
});


// iOSTimePicker end


