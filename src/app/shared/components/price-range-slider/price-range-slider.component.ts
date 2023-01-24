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
  
  @Input() activeTab: String = "";
  
  constructor() { }

  ngOnInit(): void {
    //this.sender.emit([this.minValue, this.maxValue])
    // console.log("price range slider works!")
    // console.log(this.receivedValue, " sureee")
    
    if(this.activeTab == 'buy'){
      this.options.floor = 300000
      this.options.ceil = 40000000

      this.minValue = 300000
      this.maxValue = 40000000
    } else{
      this.options.floor = 3000
      this.options.ceil = 400000

      
      this.minValue = 3000
      this.maxValue = 400000
    }
  }

  onSliderChange(){
    this.sender.emit([this.minValue, this.maxValue])
  }
}
