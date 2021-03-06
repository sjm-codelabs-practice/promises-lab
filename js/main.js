/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/* jshint esversion: 6 */

const app = (() => {
  /* Helper functions */

  function logSuccess(result) {
    console.log(`Success!:\n${result}`);
  }

  function logError(err) {
    console.log(`Oh no!:\n${err}`);
  }

  function returnFalse() {
    return false;
  }

  function fetchFlag(imageName) {
    return fetch(`flags/${imageName}`); // fetch returns a promise
  }

  function processFlag(flagResponse) {
    if (!flagResponse.ok) {
      throw Error("Bad response for flag request!"); // This will implicitly reject
    }
    return flagResponse.blob(); // blob() returns a promise
  }

  function appendFlag(flagBlob) {
    const flagImage = document.createElement("img");
    const flagDataURL = URL.createObjectURL(flagBlob);
    flagImage.src = flagDataURL;
    const imgContainer = document.getElementById("img-container");
    imgContainer.appendChild(flagImage);
    imgContainer.style.visibility = "visible";
  }

  function fallbackName() {
    return "chile.png";
  }

  function getImageName(country) {
    const countryLower = country.toLowerCase();
    const promiseOfImageName = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          countryLower === "spain" ||
          countryLower === "chile" ||
          countryLower === "peru"
        ) {
          resolve(`${countryLower}.png`);
        } else {
          reject(Error("Didn't receive a valid country name!"));
        }
      }, 1000);
    });
    console.log(promiseOfImageName);
    return promiseOfImageName;
  }

  function isSpain(country) {
    const promiseOfImageName = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (country === "Spain") {
          resolve(`${country}.png`);
        } else {
          reject(Error("Didn't receive a valid country name!"));
        }
      }, 1000);
    });
    console.log(promiseOfImageName);
    return promiseOfImageName;
  }

  function flagChain(country) {
    return getImageName(country)
      .catch(fallbackName)
      .then(fetchFlag)
      .then(processFlag)
      .then(appendFlag)
      .catch(logError);
  }

  function allFlags(promiseList) {
    return Promise.all(promiseList)
      .then(values => values)
      .catch(reason => false);
  }

  const promises = [getImageName("Spain"), getImageName("Chile"), getImageName("Peru")];

  allFlags(promises).then(result => {
    console.log(result);
  });

  const promise1 = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, "one");
  });

  const promise2 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, "two");
  });

  // since this is a race, it returns the result of the first resolved promise only
  Promise.race([promise1, promise2])
    .then(logSuccess)
    .catch(logError);

  // Don't worry if you don't understand this, it's not part of Promises.
  // We are using the JavaScript Module Pattern to enable unit testing of
  // our functions.
  return {
    getImageName,
    flagChain,
    isSpain,
    fetchFlag,
    processFlag,
    appendFlag,
    allFlags,
  };
})();
