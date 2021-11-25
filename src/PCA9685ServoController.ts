import i2cBus from "i2c-bus";
import { Pca9685Driver, Pca9685Options } from "pca9685";
import { ServoControllerFactory, PwmWriter, HardwareInterface, IServoController } from "@fustaro/servo-core";

export const defaultOptions = (): Pca9685Options => {
    return {
        i2c: i2cBus.openSync(1),
        address: 0x40,
        frequency: 50,
        debug: false
    }
}

export const getOrCreatePCA9685Controller = (uniqueHardwareName: string, options: Pca9685Options = defaultOptions()): IServoController => {
    let controller = ServoControllerFactory.get(uniqueHardwareName);

    if(!controller){
        const pca9685 = new Pca9685Driver(options, error => {
            if(error){
                console.log("Error initializing PCA9685: "+JSON.stringify(error));
                process.exit(-1);
            }
        });

        const servoDriver: PwmWriter = {
            writePwm: (channel: number, pwm: number, callback?: Function): void => {
                pca9685.setPulseLength(channel, pwm, 0, callback as any);
            }
        }

        const pca9685ServoHardwareDriver = new HardwareInterface(servoDriver, uniqueHardwareName, 16, true);

        controller = ServoControllerFactory.create(pca9685ServoHardwareDriver);
    }

    return controller;
}
