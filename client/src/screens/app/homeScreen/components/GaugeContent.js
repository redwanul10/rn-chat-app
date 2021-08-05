const gaugeHtml = `
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width initial-scale=0.87, ,user-scalable=0"
    />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gauge.js/1.3.7/gauge.min.js"></script>
  </head>
  <body>
    <div style="display: flex; justify-content: center">
      <div>
        <canvas id="foo" style="margin: 0 auto"> </canvas>
        <div id="preview-textfield" style="font-weight: bold; text-align: center"></div>
      </div>
    </div>

    <script>
      var opts = {
        angle: 0, /// The span of the gauge arc
        lineWidth: 0.54, // The line thickness
        pointer: {
          length: 0.6, // Relative to gauge radius
          strokeWidth: 0.035, // The thickness
        },
        limitMax: false,
        limitMin: false,
        staticLabels: {
          font: "15px nexa", // Specifies font
          labels: [0, 50, 100], // Print labels at these values
          color: "#000000", // Optional: Label text color
          fractionDigits: 0, // Optional: Numerical precision. 0=round off.
        },
        colorStart: "#048E15", // Colors
        colorStop: "#09D122", // just experiment with them
        strokeColor: "#FF4757", // to see which ones work best for you
      };
      var target = document.getElementById("foo"); // your canvas element
      var gauge = new Gauge(target).setOptions(opts);
      gauge.maxValue = 100; // set max gauge value
      gauge.setMinValue(0); // set min value
      gauge.set(0);

      var textRenderer = new TextRenderer(
        document.getElementById("preview-textfield")
      );

      textRenderer.render = function (gauge) {
        percentage = gauge.displayedValue - gauge.minValue;
        // (gauge.maxValue-gauge.minValue)
        this.el.innerHTML = percentage.toFixed(2) + "%";
      };
      gauge.setTextField(textRenderer);

      if (navigator.appVersion.includes("Android")) {
        document.addEventListener("message", function (data) {
          var options = data.data;
          var parsed = JSON.parse(options);
          // alert(parsed.targetAmount)
          //  setTimeout(()=> gauge.set(parsed.targetAmount),200)

          gauge.set(parsed.targetAmount);
        });
      } else {
        window.addEventListener("message", function (data) {
          //   alert("got message");
        });
      }
    </script>
  </body>
</html>

`;

export default gaugeHtml;
