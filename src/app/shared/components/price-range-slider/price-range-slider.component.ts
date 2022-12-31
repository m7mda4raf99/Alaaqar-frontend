import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-price-range-slider',
  templateUrl: './price-range-slider.component.html',
  styleUrls: ['./price-range-slider.component.scss']
})
export class PriceRangeSliderComponent implements OnInit {
  
  @Output() sender = new EventEmitter();

  
  minValue: number = 3000000;
  maxValue: number = 6000000;
  options: Options = {
    floor: 0,
    ceil: 10000000
  };
  
  @Input() receivedValue: String = "";

  constructor() { }

  ngOnInit(): void {
    //this.sender.emit([this.minValue, this.maxValue])
    // console.log("price range slider works!")
    // console.log(this.receivedValue, " sureee")
  }

  onSliderChange(){
    // console.log("slider changes", this.minValue, this.maxValue)
    this.sender.emit([this.minValue, this.maxValue])
  }
}
