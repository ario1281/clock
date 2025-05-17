
// id of the clock face.
// DONT CHANGE THIS UNLESS YOU KNOW WHAT YOU ARE DOING!
const WRAP_ID = 'clock_wrapper';
const DRAW_ID = 'dw_clock_object';

const CLOCK_STYLE = 'clock_style';
const CLOCK_DATE  = 'clock_date';
const CLOCK_TIME  = 'clock_time';


const fmt_date = '%Y/%M/%D(%W)';
const fmt_time = '%h:%m:%s';

// 'smooth' or 'ticktack'
const clock_style = 'smooth';

const week = {
    'sunday':'日',
    'monday':'月',
    'tuesday':'火',
    'wednesday':'水',
    'thursday':'木',
    'friday':'金',
    'saturday':'土',
};

// timer object
let dwClockTimer;

//
class dwClock {
    constructor() {
        this.m_time = new Date();
        this.m_days = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
        ];

        this.m_eDate = document.querySelector(`#${WRAP_ID} .${CLOCK_DATE}`);
        this.m_eTime = document.querySelector(`#${WRAP_ID} .${CLOCK_TIME}`);

        this.init();
    }

    // accesser
    get time() { return this.m_time; }

    year() { return this.m_time.getFullYear(); }
    month() { return this.m_time.getMonth() + 1; }
    date() { return this.m_time.getDate(); }
    day() { return this.m_days[this.m_time.getDay()]; }

    hours() { return this.m_time.getHours(); }
    minutes() { return this.m_time.getMinutes(); }
    seconds() { return this.m_time.getSeconds(); }
    milliseconds() { return this.m_time.getMilliseconds(); }

    // functions
    init() {
        this.display_date();
        this.display_time();
    }
    update() {
        this.tick();

        this.display_date();
        this.display_time();
    }

    display_date() {
        // format it as ISO 8601 text
        let fmt = fmt_date.toUpperCase();
        fmt = fmt.replace('%Y', this.year().toString());
        fmt = fmt.replace('%M', this.month().toString().padStart(2, '0'));
        fmt = fmt.replace('%D', this.date().toString().padStart(2, '0'));
        fmt = fmt.replace('%W', week[this.day()]);

        // assign text to element with class as 'clock_date' variable
        this.m_eDate.innerHTML = ` ${fmt} `;
    }
    display_time() { }

    tick() {
        this.m_time = new Date();
    }
    format(fmt) {
        return this.m_time.toLocaleString(fmt);
    }
    formatArgs(fmt, args) {
        return this.m_time.toLocaleString(fmt, args);
    }
};

window.addEventListener('load', () => {

    // 'dwClock' inherited class
    class dwClock_Analog extends dwClock {
        init() {
            this.m_eTime.innerHTML = '';
            this.create_dials();
            this.create_hands();

            super.init();
        }

        create_dials() {
            const dials = document.createElement('div');
            dials.classList.add('dials');
            for (var i = 1; i <= 12; i++) {
                const elem = document.createElement('div');
                elem.classList.add(i);
                elem.style.transform = `rotate(${i * 30}deg)`;
                dials.appendChild(elem);
            }
            this.m_eTime.appendChild(dials);
        }
        create_hands() {
            const second = document.createElement('div');
            const minute = document.createElement('div');
            const hour   = document.createElement('div');

            let height;

            second.className = 'hand second';
            minute.className = 'hand minute';
            hour.className   = 'hand hour';

            this.m_eTime.appendChild(second);
            this.m_eTime.appendChild(minute);
            this.m_eTime.appendChild(hour);

            // resize height
            height = `${this.m_eTime.scrollWidth * 0.75}px`;
            this.m_eTime.style.height = height;
            window.addEventListener('resize', () => {
                height = `${this.m_eTime.scrollWidth * 0.75}px`;
                this.m_eTime.style.height = height;
            });

            if (clock_style.includes('smooth')) {
                // update animation
                this.animation_hands();

                window.addEventListener('resize', () => {
                    const elem = document.querySelector(`#${WRAP_ID}`);
                    if (elem.checkVisibility()) { return; }

                    document.head.querySelector(`.${CLOCK_STYLE}`).remove();
                    this.animation_hands();
                });
            }
        }

        animation_hands() {
            //
            const fff = (360 / 1000) * this.milliseconds();
            const ss  = (360 / 60) * this.seconds() + (fff / 60);
            const mm  = (360 / 60) * this.minutes() + (ss / 60);
            const HH  = (360 / 12) * this.hours() + (mm / 12);

            const animation = document.createElement('style');
            animation.classList.add(CLOCK_STYLE);
            animation.innerHTML = `
            @keyframes rotate-s {
                0% { transform: rotate(${ss}deg); }
                100% { transform: rotate(${ss + 360}deg); }
            }
            @keyframes rotate-m {
                0% { transform: rotate(${mm}deg); }
                100% { transform: rotate(${mm + 360}deg); }
            }
            @keyframes rotate-h {
                0% { transform: rotate(${HH}deg); }
                100% { transform: rotate(${HH + 360}deg); }
            }`;
            document.head.appendChild(animation);

            //
            const second = this.m_eTime.querySelector('.hand.second');
            const minute = this.m_eTime.querySelector('.hand.minute');
            const hour   = this.m_eTime.querySelector('.hand.hour');

            second.style.animation = `rotate-s ${60}s linear infinite`;
            minute.style.animation = `rotate-m ${60 * 60}s linear infinite`;
            hour.style.animation   = `rotate-h ${60 * 60 * 12}s linear infinite`;
        }

        display_time() {
            if (clock_style.includes('ticktack')) {
                const second = this.m_eTime.querySelector('.hand.second');
                const minute = this.m_eTime.querySelector('.hand.minute');
                const hour = this.m_eTime.querySelector('.hand.hour');

                const ss = (360 / 60) * this.seconds();
                const mm = (360 / 60) * this.minutes() + (ss / 60);
                const HH = (360 / 12) * this.hours() + (mm / 12);

                second.style.transform = `rotate(${ss}deg)`;
                minute.style.transform = `rotate(${mm}deg)`;
                hour.style.transform   = `rotate(${HH}deg)`;
            }
        }
    }
    class dwClock_Digital extends dwClock {
        display_time() {
            // format it as ISO 8601 text
            let fmt = fmt_time.toLowerCase();
            fmt = fmt.replace('%f', this.milliseconds().toString().padStart(2, '0'));
            fmt = fmt.replace('%s', this.seconds().toString().padStart(2, '0'));
            fmt = fmt.replace('%m', this.minutes().toString().padStart(2, '0'));
            fmt = fmt.replace('%h', this.hours().toString().padStart(2, '0'));

            // assign text to element
            this.m_eTime.innerHTML = ` ${fmt} `;
        }
    }
    class dwClock_Binary extends dwClock {
        init() {
            this.m_eTime.innerHTML = '';
            this.create_binary('hour');
            this.create_binary('minute');
            this.create_binary('second');

            super.init();
        }
        create_binary(name) {
            const bin_elem = document.createElement('div');
            const tens_elem = document.createElement('div');
            const ones_elem = document.createElement('div');

            bin_elem.classList.add(name);
            tens_elem.classList.add('tens');
            ones_elem.classList.add('ones');

            for (var i = 0; i < 4; i++) {
                const elem = document.createElement('div');
                elem.classList.add('dial');
                elem.style.visibility = 'hidden';

                tens_elem.appendChild(elem.cloneNode(true));
                ones_elem.appendChild(elem.cloneNode(true));
            }

            bin_elem.appendChild(tens_elem);
            bin_elem.appendChild(ones_elem);

            this.m_eTime.appendChild(bin_elem);
        }

        display_time() {
            this.update_binary('hour', this.hours());
            this.update_binary('minute', this.minutes());
            this.update_binary('second', this.seconds());
        }

        update_binary(name, time) {
            const tens_elem = this.m_eTime.querySelector(`.${name} .tens`);
            const ones_elem = this.m_eTime.querySelector(`.${name} .ones`);

            const tens = this.number_place(time, 2).toString(2).padStart(4, '0');
            const ones = this.number_place(time, 1).toString(2).padStart(4, '0');

            for (var i = 0; i < 4; i++) {
                const ten = tens_elem.childNodes[i];
                const one = ones_elem.childNodes[i];

                ten.style.visibility = 'hidden';
                one.style.visibility = 'hidden';

                if (parseInt(tens[i])) {
                    ten.style.visibility = 'visible';
                }
                if (parseInt(ones[i])) {
                    one.style.visibility = 'visible';
                }
            }
        }

        number_place(num, place) {
            return (Math.floor(num / Math.pow(10, place - 1))) % 10;
        }
    }

    // clock style
    dwClockTimer = new dwClock();
    const elem = document.querySelector(`#${WRAP_ID} .${CLOCK_TIME}`);
    if (elem.className.includes('analog')) {
        dwClockTimer = new dwClock_Analog();
    }
    if (elem.className.includes('digital')) {
        dwClockTimer = new dwClock_Digital();
    }
    if (elem.className.includes('binary')) {
        dwClockTimer = new dwClock_Binary();
    }

    // ticks the clock
    setInterval(() => { dwClockTimer.update(); }, 500);
});

// end of js/script.js