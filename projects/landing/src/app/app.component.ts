import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
    const imageDivs = document.querySelectorAll('.sliderImgDiv');
    const text = document.querySelectorAll('.sliderBoxText');
    const dots = document.querySelectorAll('.sliderDot');

    let i = 0;

    setInterval(() => {
      if (i < 2) {
        i++;
        imageDivs[i].classList.remove('not');
        imageDivs[i - 1].classList.add('not');
        text[i].classList.remove('not');
        text[i - 1].classList.add('not');
        dots[i].classList.add('selectedDot');
        dots[i - 1].classList.remove('selectedDot');
        return;
      }
      if (i == 2) {
        imageDivs[0].classList.remove('not');
        imageDivs[2].classList.add('not');
        text[0].classList.remove('not');
        text[2].classList.add('not');
        dots[0].classList.add('selectedDot');
        dots[2].classList.remove('selectedDot');
        i = 0;
      }
    }, 3000);

    const button = document.querySelector('.sliderBtn');

    button &&
      button.addEventListener('click', () => {
        if (i < 2) {
          i++;
          imageDivs[i].classList.remove('not');
          imageDivs[i - 1].classList.add('not');
          text[i].classList.remove('not');
          text[i - 1].classList.add('not');
          dots[i].classList.add('selectedDot');
          dots[i - 1].classList.remove('selectedDot');
          return;
        }
        if (i == 2) {
          imageDivs[0].classList.remove('not');
          imageDivs[2].classList.add('not');
          text[0].classList.remove('not');
          text[2].classList.add('not');
          dots[0].classList.add('selectedDot');
          dots[2].classList.remove('selectedDot');
          i = 0;
        }
      });

    const dash1 = document.querySelector('#dash1') as HTMLElement;
    const dash2 = document.querySelector('#dash2') as HTMLElement;
    const dash3 = document.querySelector('.dash3full') as HTMLElement;

    document.addEventListener('scroll', () => {
      const scrolled = window.scrollY;

      if (scrolled > 300) {
        dash1.style.transform = 'translateX(000px)';
        dash2.style.transform = 'translateX(000px)';
        dash3.style.transform = 'translateY(000px)';
        dash1.style.opacity = '1';
        dash2.style.opacity = '1';
        dash3.style.opacity = '1';
      }
    });

    const burger = document.querySelector('#burger');

    const menu = document.querySelector('.mobilemenu') as HTMLElement;

    let z = 0;

    burger &&
      burger.addEventListener('click', () => {
        if (z == 0) {
          menu.style.display = 'flex';
          z = 1;
        } else {
          menu.style.display = 'none';
          z = 0;
        }
      });
  }
  title = 'landing';
}
