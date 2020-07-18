
const speed = [0, 0];
const scoreSpan = document.getElementById("score");
let score = 0;

class WindowOnEndChecker {
    moveBy(speedX, speedY) {
        this.start(speedX, speedY);
        window.moveBy(speedX, speedY);
        return this.end();
    }
    start(speedX, speedY) {
        this.lastX = screenX;
        this.lastY = screenY;
        this.speedX = speedX;
        this.speedY = speedY;
    }
    end() {
        return (
            [
                (
                    this.lastX === screenX && Math.floor(Math.abs(this.speedX)) !== 0
                    &&
                    (
                        this.speedX < 0
                        ?
                            -1
                        :
                            1
                    )
                )
                +0
                ,
                (
                    this.lastY === screenY && Math.floor(Math.abs(this.speedY)) !== 0
                    &&
                    (
                        this.speedY < 0
                        ?
                            -1
                        :
                            1
                    )
                )
                +0
            ]
        );
    }
}

window.addEventListener("message", e => {
    const windowOnEndChecker = new WindowOnEndChecker;
    const options = e.data;

    function multiply(num) {
        return num/20;
    }

    document.body.addEventListener("mousemove", e => {
        const x = e.clientX - innerWidth/2;
        const y = e.clientY - innerHeight/2;
        const xPower = -x//-(x < 0 ? -1 : 1) * (innerWidth/2 - Math.abs(x));
        const yPower = -y//-(y < 0 ? -1 : 1) * (innerHeight/2 - Math.abs(y));
        speed[0] += multiply(xPower);
        speed[1] += multiply(yPower);
        //console.log(xPower, yPower);
    });

    let prevSpeedY = speed[1];
    setInterval(() => {
        const [onEndX, onEndY] = windowOnEndChecker.moveBy(...speed);

        if(prevSpeedY > 0 && speed[1] <= 0)
            score++;

        speed[0] *= 0.98 * (onEndX ? -0.7 : 1);
        speed[1] *= 0.98 * (onEndY ? -0.7 : 1);
        if(options.gravity)
            speed[1] += 1;
        
        if(onEndX || onEndY) {
            window.opener.postMessage({
                type:"SCORE",
                options,
                score
            }, "*");
            score = 0;
        }
        
        scoreSpan.innerText = score;
        prevSpeedY = speed[1];
    }, 20);
});

//window.postMessage({}, "*");
window.opener.postMessage({type:"INIT"}, "*");