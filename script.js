window.onload = function () {
    const overlay = document.getElementById('loaded-animation');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 1000);
};

var phase = 0;

function handlePhase() {
    if (phase === 0) {
        phaseOne();
    } else if (phase === 1) {
        phaseTwo();
    }
}

// Start handling phases
handlePhase();

function phaseOne() {
    console.log('Phase One is running');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const button_getstarted = document.getElementById('getstarted');
    const circles = [];
    const circleCount = 50;
    const circleRadius = 12;
    const connectionDistance = 200;
    const lineRadius = 4;

    // Variables for the animation
    let focusBall = null; // The ball to focus on
    let isFocusing = false; // Whether the focusing effect is active
    let focusProgress = 0; // Progress of the ball moving and expanding

    class Circle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.radius = circleRadius;
            this.dx = (Math.random() - 0.5) * 2;
            this.dy = (Math.random() - 0.5) * 2;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.closePath();
        }

        update() {
            if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
                this.dx = -this.dx;
            }
            if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
                this.dy = -this.dy;
            }
            this.x += this.dx;
            this.y += this.dy;
        }
    }

    for (let i = 0; i < circleCount; i++) {
        const x = Math.random() * (canvas.width - circleRadius * 2) + circleRadius;
        const y = Math.random() * (canvas.height - circleRadius * 2) + circleRadius;
        circles.push(new Circle(x, y));
    }

    function drawLines() {
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                const dx = circles[i].x - circles[j].x;
                const dy = circles[i].y - circles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < connectionDistance) {
                    const opacity = 1 - distance / connectionDistance;
                    ctx.beginPath();
                    ctx.moveTo(circles[i].x, circles[i].y);
                    ctx.lineTo(circles[j].x, circles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = lineRadius;
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        circles.forEach(circle => {
            if (circle !== focusBall || !isFocusing) {
                circle.update();
            }
            circle.draw();
        });

        drawLines();

        if (isFocusing && focusBall) {
            focusProgress += 0.001; 
            const easedProgress = easeInOutQuad(focusProgress);

            const targetX = canvas.width / 2;
            const targetY = canvas.height / 2;
            const targetRadius = Math.max(canvas.width, canvas.height);

            focusBall.x += (targetX - focusBall.x) * easedProgress;
            focusBall.y += (targetY - focusBall.y) * easedProgress;
            focusBall.radius += (targetRadius - focusBall.radius) * easedProgress;

            focusBall.draw();

            if (focusBall.radius >= targetRadius - 1) {
                phase = 1; // Transition to phase 2 after phase 1 completes
                handlePhase(); // Ensure phase 2 is triggered
                return;
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    function slideUpElement() {
        const element = document.getElementById('layer1');
        element.classList.add('slide-up');
        setTimeout(() => {
            element.style.display = 'none';
            setTimeout(() => {
                focusBall = circles[Math.floor(Math.random() * circles.length)];
                isFocusing = true;
                focusProgress = 0;
            });
        }, 1000);
    }

    button_getstarted.addEventListener('click', function () {
        slideUpElement();
    });
}

function phaseTwo() {
    console.log('Phase Two is running');
}
