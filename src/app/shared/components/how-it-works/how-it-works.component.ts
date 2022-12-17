import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, query, animateChild, state, useAnimation } from '@angular/animations';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss'],
  animations: [
    trigger('flyInParent', [
      transition(':enter, :leave', [
        query('@*', animateChild())
      ])
    ]),
    trigger("fadeInOut", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("1000ms 1000ms", style({ opacity: 1 }))
      ]),
      transition(":leave", [animate(1000, style({ opacity: 0 }))])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ],
})
export class HowItWorksComponent implements OnInit {
  switcher: any = 'buyer'
  buyer: string = 'buyer'
  seller: any = 'seller'
  bounce: any;
  constructor( 
    private metaService: Meta,
    private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('How it Works | Buy and Rent Ain Sokhna | Alaaqar');
    this.metaService.addTags([
      {name: 'description', content: "This is the simplest way to purchase, sell or lease commercial or residential properties. We've developed a custom algorithm, as well as skilled, professional agents."},
    ]);
  }
}


