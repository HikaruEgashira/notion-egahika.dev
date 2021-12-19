/* eslint-disable */

;(function () {
  var storageKey = 'darkMode'
  var classNameDark = 'dark-mode'
  var classNameLight = 'light-mode'

  function setClassOnDocumentBody(isDarkMode) {
    document.body.classList.add(isDarkMode ? classNameDark : classNameLight)
    document.body.classList.remove(isDarkMode ? classNameLight : classNameDark)
  }

  var localStorageTheme = null
  try {
    localStorageTheme = localStorage.getItem(storageKey)
  } catch (err) {}
  var localStorageExists = localStorageTheme !== null
  if (localStorageExists) {
    localStorageTheme = JSON.parse(localStorageTheme)
  }

  if (localStorageExists) {
    setClassOnDocumentBody(localStorageTheme)
  } else {
    var isDarkMode = true
    localStorage.setItem(storageKey, JSON.stringify(isDarkMode))
    setClassOnDocumentBody(isDarkMode)
  }
})()
