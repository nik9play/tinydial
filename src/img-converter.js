function urlToDataUrl(url, callback, outputFormat) {
  let img = new Image()
  img.crossOrigin = 'Anonymous'
  img.onload = function() {
    let canvas = document.createElement('CANVAS')
    let ctx = canvas.getContext('2d'), dataURL
    canvas.height = img.height
    canvas.width = img.width
    ctx.drawImage(img, 0, 0)
    dataURL = canvas.toDataURL(outputFormat)
    callback(dataURL)
    canvas = null
  }
  img.onerror = function() {
    callback("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALJSURBVHgBxZe/buJAEMbXBkSBhKCgQKIwLRXu6Lg0dOhyNY3fIMoT3OUNLk9wNHQ0aWkSOjqo6BAukJAQEhZU/L/59rzIcAbvGkf5ScQbr73f7OzM7FpjkiwWi8x+v3+kZlXTtDJdjePxmEEf/e/QxabfQNf1D7q+ZbNZR2ZcLegBEjYOh8MTNS0hKDWwpjXJmBcyxL75HLsujBn/ouYTuwMy5LdriCNtgDvrd5qxwSKAjLDJiAc/b+g+4uUoxQHGwpiz2ax82addiBtRi5+J+XhC84hnSLz/WeIXRpgiJuKiww04I2iA9XrN+v0+Gw6HbLlc8nu5XI4VCgVWqVRYMpm8+b67HD+p+cwNwh+4ngwYswAg2G63T8KXpNNp1mg0Ao0AsVisiKXgHnAtCqTX63FxCNTrdT5rAG90u13eB+/AE0G4teVZx9qTWywmwWQy4ddqtXoSB6VSif/AaDSSGQpLYUE77pZXKcTMvOICxAFAjEiCQvc9TlFZJWuk3hCz9EMIy6y/h28oRGUWAVh74Oeda9DEy3oUed/pdHgAIgtM05R+j7xvwAPSO9w1cWQBQGbACAUyOrsDpKUQr9Vqp0BUAQZIHRwugcthAEBa3grQGzg6ajMLgch31XX3QvFnwwMDFgKRdoprfgZNfqDN53OL2n/Y12Bp7tELG9Fd2RAG2pCyOvZlHCCZIlgC75Ycgia0eRpuNptXpggyADWg1WqxMGy32xdcuQH5fN7G6VVlABF8irWfAy1o8ra46cYCCrohOc7pbKBohL1arcxiseicGQCm06mRSCTeVYxQxCbXP4jZg7NSjA46qfxg/z6zIhfH2F5x4Pth8gme+G/mAt/NCA9SjpqqgekHxsCa+4nz/qABXG/g0GoxeRyq883dbvd6TVjaAMF4PM6kUqlH+qjgn+fuQUZUTxQzm+4NyHMfjuO8iSgP4i8E4Wrd5mOluAAAAABJRU5ErkJggg==")
  }
  img.src = url
}

function checkDark(imageSrc, callback) {
  var fuzzy = 0.1
  var img = document.createElement("img")
  img.src = imageSrc
  img.style.display = "none"
  document.body.appendChild(img)

  img.onload = function() {
    var canvas = document.createElement("canvas")
    canvas.width = this.width
    canvas.height = this.height

    var ctx = canvas.getContext("2d")
    ctx.drawImage(this,0,0)

    var imageData = ctx.getImageData(0,0,canvas.width,canvas.height)
    var data = imageData.data
    var r,g,b, max_rgb
    var light = 0, dark = 0

    for(var x = 0, len = data.length; x < len; x+=4) {
      r = data[x]
      g = data[x+1]
      b = data[x+2]

      max_rgb = Math.max(Math.max(r, g), b)
      if (max_rgb < 128)
        dark++
      else
        light++
    }

    var dl_diff = ((light - dark) / (this.width*this.height))
    if (dl_diff + fuzzy < 0)
      callback(true)
    else
      callback(false)
  }
}

export { urlToDataUrl, checkDark }