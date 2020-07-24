/*Author: Sergei Illarionov 2020 copyright ©*/

function Gallery(arg) {
  if (arg.zoom === undefined) {
    arg.zoom = true;
  }
  if (arg.grab === undefined) {
    arg.grab = true;
  }
  if (arg.fullsize === undefined) {
    arg.fullsize = true;
  }
  if (arg.strictfullsize === undefined) {
    arg.strictfullsize = true;
  }
  if (arg.counter === undefined) {
    arg.counter = true;
  }

  if (arg.images.length < 2) {
    arg.counter = false;
  }
  if (arg.center === undefined) {
    arg.center = true;
  }

  window.addEventListener('load', () => {
    let frame = CreateHTML(arg);
    Initiazlize(frame, arg);
  });

  function CreateHTML(arg) {
    let parentNode = document.querySelectorAll(arg.wrapper)[0];
    let element = document.createElement('div');
    element.classList.add('frame-container');
    let frameNode = parentNode.appendChild(element);

    if ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch)) {
    } else {
      frameNode.classList.add('no-touch');
    }

    element = document.createElement('div');
    element.classList.add('buttons-area');
    let zoomAreaNode = frameNode.appendChild(element);

    element = document.createElement('div');
    element.classList.add('buttons');
    let zoomButtonsNode = zoomAreaNode.appendChild(element);

    element = document.createElement('div');
    element.classList.add('loader','hide');
    element.innerHTML= '<svg width="38" height="38" viewBox="0 0 38 38" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity=".5" cx="18" cy="18" r="18"/><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/></path></g></g></svg>';
    zoomAreaNode.appendChild(element);
   
    if (arg.zoom) {
      element = document.createElement('span');
      element.innerHTML = '<svg  width="512.000000pt" height="512.000000pt" viewBox="0 0 100 100"><path stroke="rgba(0, 0, 0, 0.5)" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round" d="M 50 20 v 60 " /><path stroke="rgba(0, 0, 0, 0.5)" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round" d="M 20 50  h 60 " /></svg>';
      element.classList.add('zoom-in');
      zoomButtonsNode.appendChild(element);

      element = document.createElement('span');
      element.innerHTML = '<svg  width="512.000000pt" height="512.000000pt" viewBox="0 0 100 100"><path stroke="rgba(0, 0, 0, 0.5)" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round" d="M 20 50  h 60 " /></svg>';
      element.classList.add('zoom-out');
      zoomButtonsNode.appendChild(element);
    }

    if (arg.fullsize || arg.strictfullsize) {
      element = document.createElement('span');
      element.classList.add('fullsize-button');
      element.innerHTML = '<svg  width="512.000000pt" height="512.000000pt" viewBox="0 0 100 100"><path stroke="rgba(0, 0, 0, 0.5)" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round" d="M 65 10 h 25 v 25 " /><path stroke="rgba(0, 0, 0, 0.5)" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round" d="M 10 65  v 25 h 25 " /></svg>';
      zoomButtonsNode.appendChild(element);
    }

    if (arg.center && (arg.zoom || arg.grab)) {
      element = document.createElement('span');
      element.classList.add('center-button');
      element.innerHTML = '<svg  width="512.000000pt" height="512.000000pt" viewBox="0 0 100 100"><path stroke="rgba(0, 0, 0, 0.5)" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round" d="M 10 10 h 80 v 80 h -80 v -80 "></path> <path stroke="rgba(0, 0, 0, 0.5)" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round" d="M 30 30 h 40 v 40 h -40 v -40 "></path></svg>';
      zoomButtonsNode.appendChild(element);
    }

    if (arg.images.length > 1) {
      element = document.createElement('div');
      element.classList.add('buttons', 'next');
      let nextNode = zoomAreaNode.appendChild(element);

      element = document.createElement('span');
      element.classList.add('next-button');
      element.innerHTML = '<svg  width="512.000000pt" height="512.000000pt" viewBox="0 0 100 100"><path stroke="rgba(0, 0, 0, 0.5)" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round" d="M 30 30 L 70 50 " /><path stroke="rgba(0, 0, 0, 0.5)" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round" d="M 70 50  L 30 70 " /></svg>';
      nextNode.appendChild(element);

      element = document.createElement('div');
      element.classList.add('buttons', 'prev');
      let prevNode = zoomAreaNode.appendChild(element);

      element = document.createElement('span');
      element.classList.add('prev-button');
      element.innerHTML = '<svg  width="512.000000pt" height="512.000000pt" viewBox="0 0 100 100"><path stroke="rgba(0, 0, 0, 0.5)" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round" d="M 70 30 L 30 50 " /><path stroke="rgba(0, 0, 0, 0.5)" stroke-width="6" fill="none" stroke-linejoin="round" stroke-linecap="round" d="M 30 50  L 70 70 " /></svg>';
      prevNode.appendChild(element);
    }

    if (arg.counter) {
      element = document.createElement('div');
      element.classList.add('counter');
      let counterNode = zoomAreaNode.appendChild(element);

      element = document.createElement('span');
      element.classList.add('counter-current');
      counterNode.appendChild(element);

      element = document.createElement('span');
      element.classList.add('counter-total');
      counterNode.appendChild(element);
    }

    element = document.createElement('img');
    element.classList.add('image-container');
    frameNode.appendChild(element);

    return frameNode;
  }

  function Initiazlize(frame, arg) {
    const frameNode = frame;
    const imageContainerNode = frameNode.querySelector('.image-container');
    const zoomInNode = frameNode.querySelector('.zoom-in');
    const zoomOutNode = frameNode.querySelector('.zoom-out');
    const fullsizeNode = frameNode.querySelector('.fullsize-button');
    const nextNode = frameNode.querySelector('.next-button');
    const prevNode = frameNode.querySelector('.prev-button');
    const centerNode = frameNode.querySelector('.center-button');
    const counterCurrentNode = frameNode.querySelector('.counter-current');
    const counterTotalNode = frameNode.querySelector('.counter-total');
    const loaderNode = frameNode.querySelector('.loader');

    imageContainerNode.src = arg.images[0];
    frameNode.images = arg.images;
    frameNode.currentImage = 0;
    if (counterTotalNode) {
      counterCurrentNode.innerText = frameNode.currentImage + 1;
      counterTotalNode.innerHTML = '&#160;/&#160;' + frameNode.images.length;
    }

    if (!arg.grab) {
      imageContainerNode.style.cursor = 'initial';
    }

    /*Setups start*/

    let settings = new Object();
    settings.scaleScope = new Object();
    settings.scaleScope.initial = Math.min(frameNode.clientWidth / imageContainerNode.clientWidth, frameNode.clientHeight / imageContainerNode.clientHeight);
    settings.scaleScope.min = 1; /*min zoom availible*/
    settings.scaleScope.max = 5; /*max zoom availible*/

    /*Setups end*/

    let state = new Object();
    state.moving = false;
    state.scaling = false;
    state.click = new Object();
    state.click.left = null;
    state.click.top = null;
    state.checkBorders = new Object();
    state.checkBorders.x = null;
    state.checkBorders.y = null;
    state.autoscaling = null;
    state.autoscaleFlag = null;
    state.touchDist = null;
    state.scale = settings.scaleScope.initial;
    state.zoom = 1;
    state.scrollY = null;

    if ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch)) {
      state.mobile = true;
    } else {
      state.mobile = false;
    }

    frameNode.settings = settings;
    frameNode.state = state;

    defineScale(frameNode);

    function checkBordersOut() {
      let flag = false;
      if (imageContainerNode.getBoundingClientRect().height + (imageContainerNode.getBoundingClientRect().top - frameNode.getBoundingClientRect().top) < 200) {
        flag = 'top';
      }
      if (frameNode.getBoundingClientRect().height - (imageContainerNode.getBoundingClientRect().top - frameNode.getBoundingClientRect().top) < 200) {
        flag = 'bottom';
      }
      if (imageContainerNode.getBoundingClientRect().width + (imageContainerNode.getBoundingClientRect().left - frameNode.getBoundingClientRect().left) < 200) {
        flag = 'left';
      }
      if (frameNode.getBoundingClientRect().width - (imageContainerNode.getBoundingClientRect().left - frameNode.getBoundingClientRect().left) < 200) {
        flag = 'right';
      }
      return flag;
    }

    function sizeIn(step) {
      if (frameNode.state.zoom + step > frameNode.settings.scaleScope.max) {
        return;
      }
      frameNode.state.zoom = frameNode.state.zoom + step;
      imageContainerNode.style.transform = `scale(${frameNode.state.scale * frameNode.state.zoom})`;
    }

    function sizeOut(step) {
      if (frameNode.state.zoom - step < frameNode.settings.scaleScope.min) {
        return;
      }
      frameNode.state.zoom = frameNode.state.zoom - step;
      imageContainerNode.style.transform = `scale(${frameNode.state.scale * frameNode.state.zoom})`;
    }

    function defineScale(frameNode) {
      const imageContainerNode = frameNode.querySelector('.image-container');
      frameNode.settings.scaleScope.initial = Math.min(frameNode.clientWidth / imageContainerNode.clientWidth, frameNode.clientHeight / imageContainerNode.clientHeight);
      frameNode.state.scale = frameNode.settings.scaleScope.initial;
      frameNode.state.zoom = 1;
      imageContainerNode.style.left = 0;
      imageContainerNode.style.top = 0;
      imageContainerNode.style.transform = `scale(${frameNode.settings.scaleScope.initial})`;
      return frameNode.settings.scaleScope.initial;
    }

    function toggleFullSize() {
      if (!frameNode.classList.contains('fullsize')) {
        frameNode.state.scrollY = window.scrollY;
      }
      frameNode.classList.toggle('fullsize');
      defineScale(frameNode);
      if (!frameNode.classList.contains('fullsize')) {
        window.scroll(0, frameNode.state.scrollY);
      }
    }

    function beginFullscreen() {
      frameNode.state.scrollY = window.scrollY;
      if (frameNode.requestFullscreen) {
        frameNode.requestFullscreen();
      } else if (element.webkitrequestFullscreen) {
        frameNode.webkitRequestFullscreen();
      } else if (element.mozRequestFullscreen) {
        frameNode.mozRequestFullscreen();
      }
    }

    function endFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozExitFullscreen) {
        document.mozExitFullscreen();
      }
    }

    function fullscreenChange() {
      let fullscreen = document.FullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement || document.msFullscreenElement;

      if (fullscreen) {
        endFullscreen();
      } else {
        beginFullscreen();
      }
    }

    frameNode.addEventListener('webkitfullscreenchange', () => {
      defineScale(frameNode);
      window.scroll(0, frameNode.state.scrollY);
    });
    frameNode.addEventListener('mozfullscreenchange', () => {
      defineScale(frameNode);
      window.scroll(0, frameNode.state.scrollY);
    });
    frameNode.addEventListener('fullscreenchange', () => {
      defineScale(frameNode);
      window.scroll(0, frameNode.state.scrollY);
    });

    if (fullsizeNode) {
      if (frameNode.state.mobile) {
        if (arg.strictfullsize) {
          fullsizeNode.addEventListener('touchstart', fullscreenChange);
        } else {
          fullsizeNode.addEventListener('touchstart', toggleFullSize);
        }
        fullsizeNode.addEventListener('touchstart', () => {
          fullsizeNode.classList.add('hovered');
        });
        fullsizeNode.addEventListener('touchend', () => {
          setTimeout(() => {
            fullsizeNode.classList.remove('hovered');
          }, 200);
        });
      } else {
        if (arg.strictfullsize) {
          fullsizeNode.addEventListener('click', fullscreenChange);
        } else {
          fullsizeNode.addEventListener('click', toggleFullSize);
        }
      }
    }
    imageContainerNode.addEventListener('load',()=>{
      loaderNode.classList.remove('hide');
    });
    function nextImage() {
      if (frameNode.currentImage >= frameNode.images.length - 1) {
        frameNode.currentImage = 0;
      } else {
        frameNode.currentImage++;
      }
      imageContainerNode.src = '';
      loaderNode.classList.add('hide');
      imageContainerNode.src = frameNode.images[frameNode.currentImage];
      if (counterCurrentNode) {
        counterCurrentNode.innerText = frameNode.currentImage + 1;
      }
    }

    if (nextNode) {
      if (frameNode.state.mobile) {
        nextNode.addEventListener('touchstart', nextImage);
        nextNode.addEventListener('touchstart', () => {
          nextNode.classList.add('hovered');
        });
        nextNode.addEventListener('touchend', () => {
          setTimeout(() => {
            nextNode.classList.remove('hovered');
          }, 200);
        });
      } else {
        nextNode.addEventListener('click', nextImage);
      }
    }

    function prevImage() {
      if (frameNode.currentImage == 0) {
        frameNode.currentImage = frameNode.images.length - 1;
      } else {
        frameNode.currentImage--;
      }
      imageContainerNode.src = '';
      loaderNode.classList.add('hide');
      imageContainerNode.src = frameNode.images[frameNode.currentImage];
      if (counterCurrentNode) {
        counterCurrentNode.innerText = frameNode.currentImage + 1;
      }
    }

    if (prevNode) {
      if (frameNode.state.mobile) {
        prevNode.addEventListener('touchstart', prevImage);
        prevNode.addEventListener('touchstart', () => {
          prevNode.classList.add('hovered');
        });
        prevNode.addEventListener('touchend', () => {
          setTimeout(() => {
            prevNode.classList.remove('hovered');
          }, 200);
        });
      } else {
        prevNode.addEventListener('click', prevImage);
      }
    }

    if (centerNode) {
      if (frameNode.state.mobile) {
        centerNode.addEventListener('touchstart', () => {
          defineScale(frameNode);
        });
        centerNode.addEventListener('touchstart', () => {
          centerNode.classList.add('hovered');
        });
        centerNode.addEventListener('touchend', () => {
          setTimeout(() => {
            centerNode.classList.remove('hovered');
          }, 200);
        });
      } else {
        centerNode.addEventListener('click', () => {
          defineScale(frameNode);
        });
      }
    }

    if (arg.grab) {
      if (frameNode.state.mobile) {
        document.addEventListener('touchmove', (event) => {
          if (event.touches.length == 1) {
            if (frameNode.state.moving === true) {
              let check = checkBordersOut();
              if (check != false) {
                switch (check) {
                  case 'left':
                    if (event.touches[0].pageX < frameNode.state.checkBorders.x) {
                      event.preventDefault();
                      return;
                    }
                    break;
                  case 'right':
                    if (event.touches[0].pageX > frameNode.state.checkBorders.x) {
                      event.preventDefault();
                      return;
                    }
                    break;
                  case 'top':
                    if (event.touches[0].pageY < frameNode.state.checkBorders.y) {
                      event.preventDefault();
                      return;
                    }
                    break;
                  case 'bottom':
                    if (event.touches[0].pageY > frameNode.state.checkBorders.y) {
                      event.preventDefault();
                      return;
                    }
                    break;
                }
              }

              imageContainerNode.classList.add('grabbing');
              imageContainerNode.style.left = parseInt(window.getComputedStyle(imageContainerNode).left) + (event.touches[0].pageX - frameNode.state.click.left) + 'px';
              imageContainerNode.style.top = parseInt(window.getComputedStyle(imageContainerNode).top) + (event.touches[0].pageY - frameNode.state.click.top) + 'px';
              frameNode.state.click.left = event.touches[0].pageX;
              frameNode.state.click.top = event.touches[0].pageY;
            }
          }
        });

        imageContainerNode.addEventListener('touchstart', (event) => {
          if (event.touches.length == 1) {
            frameNode.state.moving = true;
            frameNode.state.click.left = event.touches[0].pageX;
            frameNode.state.click.top = event.touches[0].pageY;
            frameNode.state.checkBorders.x = event.touches[0].pageX;
            frameNode.state.checkBorders.y = event.touches[0].pageY;
            event.preventDefault();
          }
        });

        document.addEventListener('touchcancel', () => {
          frameNode.state.moving = false;
          frameNode.state.scaling = false;
          imageContainerNode.classList.remove('grabbing');
        });

        document.addEventListener('touchend', () => {
          frameNode.state.moving = false;
          frameNode.state.scaling = false;
          imageContainerNode.classList.remove('grabbing');
        });
      } else {
        imageContainerNode.addEventListener('mousedown', (event) => {
          frameNode.state.moving = true;
          frameNode.state.click.left = event.pageX;
          frameNode.state.click.top = event.pageY;
          frameNode.state.checkBorders.x = event.pageX;
          frameNode.state.checkBorders.y = event.pageY;
          imageContainerNode.classList.add('grabbing');
          event.preventDefault();
        });

        document.addEventListener('mouseup', () => {
          frameNode.state.moving = false;
          imageContainerNode.classList.remove('grabbing');
        });

        document.addEventListener('mousemove', (event) => {
          if (frameNode.state.moving === true) {
            let check = checkBordersOut();

            if (check != false) {
              switch (check) {
                case 'left':
                  if (event.pageX < frameNode.state.checkBorders.x) {
                    event.preventDefault();
                    return;
                  }
                  break;
                case 'right':
                  if (event.pageX > frameNode.state.checkBorders.x) {
                    event.preventDefault();
                    return;
                  }
                  break;
                case 'top':
                  if (event.pageY < frameNode.state.checkBorders.y) {
                    event.preventDefault();
                    return;
                  }
                  break;
                case 'bottom':
                  if (event.pageY > frameNode.state.checkBorders.y) {
                    event.preventDefault();
                    return;
                  }
                  break;
              }
            }

            imageContainerNode.style.left = parseInt(window.getComputedStyle(imageContainerNode).left) + (event.pageX - frameNode.state.click.left) + 'px';
            imageContainerNode.style.top = parseInt(window.getComputedStyle(imageContainerNode).top) + (event.pageY - frameNode.state.click.top) + 'px';
            frameNode.state.click.left = event.pageX;
            frameNode.state.click.top = event.pageY;
          }
        });
      }
    }

    if (arg.zoom) {
      if (frameNode.state.mobile) {
        if (zoomInNode) {
          zoomInNode.addEventListener('touchstart', (event) => {
            event.preventDefault();
            frameNode.state.autoscaling = setInterval(() => {
              sizeIn(0.002);
              frameNode.state.autoscaleFlag = true;
            }, 0);
          });

          document.addEventListener('touchend', () => {
            clearInterval(frameNode.state.autoscaling);
          });

          zoomInNode.addEventListener('touchstart', () => {
            zoomInNode.classList.add('hovered');
          });
          zoomInNode.addEventListener('touchend', () => {
            setTimeout(() => {
              zoomInNode.classList.remove('hovered');
            }, 200);
          });
        }

        if (zoomOutNode) {
          zoomOutNode.addEventListener('touchstart', (event) => {
            event.preventDefault();
            frameNode.state.autoscaling = setInterval(() => {
              sizeOut(0.002);
              frameNode.state.autoscaleFlag = true;
            }, 0);
          });

          document.addEventListener('touchend', () => {
            clearInterval(frameNode.state.autoscaling);
          });

          zoomOutNode.addEventListener('touchstart', () => {
            zoomOutNode.classList.add('hovered');
          });
          zoomOutNode.addEventListener('touchend', () => {
            setTimeout(() => {
              zoomOutNode.classList.remove('hovered');
            }, 200);
          });
        }

        imageContainerNode.addEventListener('touchstart', (event) => {
          if (event.touches.length == 2) {
            imageContainerNode.classList.remove('grabbing');
            frameNode.state.scaling = true;
            frameNode.state.touchDist = Math.sqrt((event.touches[0].pageX - event.touches[1].pageX) * (event.touches[0].pageX - event.touches[1].pageX) + (event.touches[0].pageY - event.touches[1].pageY) * (event.touches[0].pageY - event.touches[1].pageY));
            event.preventDefault();
          }
        });

        document.addEventListener('touchmove', (event) => {
          if (event.touches.length == 2) {
            if (frameNode.state.scaling === true) {
              let dist = Math.sqrt((event.touches[0].pageX - event.touches[1].pageX) * (event.touches[0].pageX - event.touches[1].pageX) + (event.touches[0].pageY - event.touches[1].pageY) * (event.touches[0].pageY - event.touches[1].pageY));
              if (dist - frameNode.state.touchDist > 10) {
                sizeIn(0.05);
                frameNode.state.touchDist = dist;
              } else if (dist - frameNode.state.touchDist < -10) {
                sizeOut(0.05);
                frameNode.state.touchDist = dist;
              }
            }
          }
        });
      } else {
        imageContainerNode.addEventListener('wheel', (event) => {
          event.preventDefault();
          if (event.deltaY < 0) {
            sizeIn(0.05);
          } else {
            sizeOut(0.05);
          }
        });

        if (zoomInNode) {
          zoomInNode.addEventListener('click', (event) => {
            if (!frameNode.state.autoscaleFlag) {
              event.preventDefault();
              sizeIn(0.05);
            }
            frameNode.state.autoscaleFlag = false;
            console.log('click');
          });

          zoomInNode.addEventListener('mousedown', (event) => {
            frameNode.state.autoscaling = setInterval(() => {
              sizeIn(0.002);
              frameNode.state.autoscaleFlag = true;
            }, 0);
            event.preventDefault();
          });

          document.addEventListener('mouseup', (event) => {
            clearInterval(frameNode.state.autoscaling);
          });
        }

        if (zoomOutNode) {
          zoomOutNode.addEventListener('click', (event) => {
            if (!frameNode.state.autoscaleFlag) {
              event.preventDefault();
              sizeOut(0.05);
            }
            frameNode.state.autoscaleFlag = false;
          });

          zoomOutNode.addEventListener('mousedown', (event) => {
            frameNode.state.autoscaling = setInterval(() => {
              sizeOut(0.002);
            }, 0);
            event.preventDefault();
          });

          document.addEventListener('mouseup', (event) => {
            clearInterval(frameNode.state.autoscaling);
          });
        }
      }
    }

    imageContainerNode.addEventListener('load', () => {
      defineScale(frameNode);
    });

    frameNode.addEventListener('touchstart', (event) => {
      if (event.touches.length == 2) {
        event.preventDefault();
      }
    });
  }
}
