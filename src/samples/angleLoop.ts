import { IServoController, Servo } from "@fustaro/servo-core";
import { Ticker } from '@fustaro/ticker';

let ticker;

export const beginAngleLoop = (controller: IServoController, servo: Servo, angles: number[], changeIntervalMs: number) => {
    ticker = new Ticker(changeIntervalMs, false);

    let angleIdx = 0;

    ticker.addTickable({
        tick: (deltaTimeMillis) => {
            controller.setAngleDegrees(servo, angles[angleIdx]);
            angleIdx = (angleIdx+1)% angles.length;
        }
    });

    ticker.start();
}

export const stopAngleLoop = () => {
    if(ticker) ticker.stop();
}