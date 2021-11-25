import { IServoController, Servo } from "@fustaro/servo-core";
import { Ticker } from '@fustaro/ticker';

let ticker;

export const beginSinLoop = (controller: IServoController, servo: Servo, angleRange: number, updateIntervalMs: number, loopsPerSecond: number) => {
    ticker = new Ticker(updateIntervalMs, false);

    ticker.addTickable({
        tick: (deltaTimeMillis) => {
            const angle = angleRange*Math.sin(deltaTimeMillis/1000 * Math.PI * loopsPerSecond);
            servo.setAngleDegrees(angle);
        }
    });

    ticker.start();
}

export const stopSinLoop = () => {
    if(ticker) ticker.stop();
}