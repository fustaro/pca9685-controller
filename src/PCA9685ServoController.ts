import i2cBus from "i2c-bus";
import { Pca9685Driver, Pca9685Options } from "pca9685";
import { ServoControllerFactory, ServoDriver, HardwareInterface, IServoController } from "@fustaro/servo-core";

export interface PCA9685Options extends Pca9685Options {
    stubIfUnavailable: boolean;
}

export const defaultOptions = (): PCA9685Options => {
    return {
        i2c: i2cBus.openSync(1),
        address: 0x40,
        frequency: 50,
        debug: false,
        stubIfUnavailable: false
    }
}

export const getOrCreatePCA9685Controller = (uniqueHardwareName: string, options: PCA9685Options = defaultOptions()): IServoController => {
    const controller = ServoControllerFactory.get(uniqueHardwareName);

    if(controller){
        return controller;
    }

    let pca9685 = new Pca9685Driver(options, error => {
        if(error){
            console.error("Error initializing PCA9685: "+JSON.stringify(error));

            if(!options.stubIfUnavailable){
                console.error("Exiting application. If you want to run your application with a stub, you can set PCA9685Options.stubIfUnavailable = true on your controller setup.");
                process.exit(-1);
            } else {
                console.warn("Stubbing controller, your application will run but your servos will not work");
                pca9685 = {
                    setPulseLength: () => {},
                    channelOn: () => {},
                    channelOff: () => {},
                    dispose: () => {}
                } as any;
            }
        }
    });

    const servoDriver: ServoDriver = {
        writePwm: (channel: number, pwm: number, callback?: Function): void => {
            pca9685.setPulseLength(channel, pwm, 0, callback as any);
        },
        disableServo: (channel: number): void => {
            pca9685.channelOff(channel);
        },
        enableServo: (channel: number): void => {
            pca9685.channelOn(channel);
        },
        dispose: () => {
            pca9685.dispose();
        }
    }

    const pca9685HardwareInterface = new HardwareInterface(servoDriver, uniqueHardwareName, 16, true);

    return ServoControllerFactory.create(pca9685HardwareInterface);
}
