# @fustaro/pca9685-controller

Node PCA9685 servo controller / pwm driver over I2C

```npm install @fustaro/pca9685-controller```

### Create a ServoModel, specific to the brand and model of a particular servo

```
const servoModel = new ServoModel({
    pwmRange: { min: 1000, natural: 1500, max: 2000 },
    angleRange: { min: -60, natural: 0, max: 60 },
    speed: 0.1,
    servoDirection: ServoDirection.HIGHER_PWM_CLOCKWISE
});
```

### Create Servo instances, specific to each servo you want to control

```
const servo = new Servo({
    servoModel: servoModel,
    centerOffsetPwm: 0,
    channel: 0,
    flipDirection: false
});
```

### Create your PCA9685ServoController

```
import { getOrCreatePCA9685Controller } from '@fustaro/pca9685-controller';

const controller = getOrCreatePCA9685Controller(uniqueHardwareName, options);

//uniqueHardwareName: A unique reference to a given Maestro, e.g. 'Maestro_COM4' 
//                    The ServoControllerFactory will only ever return a single
//                    ServoController for a given uniqueHardwareName

//options: see Pca9685Options class or import defaultOptions from
//         @fustaro/pca9685-controller. This default should work for RPI
```

### Run your servo

```
controller.setAngleDegrees(servo, 40);
```

### Sample scripts

```
import { beginAngleLoop, stopAngleLoop } from '@fustaro/pca9685-controller/samples/angleLoop';

const controller = <create your controller>;
const servo = <create your servo>;

//this will set your servo to 40°, 0°, -40°, 0°, etc - changing every 500ms
beginAngleLoop(controller, servo, [40, 0, -40, 0], 500);
```

```
import { beginSinLoop, stopSinLoop } from '@fustaro/pca9685-controller/samples/sinLoop';

const controller = <create your controller>;
const servo = <create your servo>;

//this will run your servo in a sin loop, +/- 40°
//updating every 15ms and doing 2 full loops every second
beginSinLoop(controller, servo, 40, 500, 15, 2);
```