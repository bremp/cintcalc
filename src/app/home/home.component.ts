import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder, private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    const defaultLimit = 100000;
    const defaultMinPaymentRate = 0.659;
    const defaultMonthlyBalance = 96597.87;
    const defaultApr = 2.75;
    const calendarDays = 365;
    const numberPattern = '^[0-9]*$';
    const currencyPattern = '^[+-]?[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$';

    this.form = this.fb.group({
      limit: [defaultLimit,
        [Validators.required, Validators.pattern(currencyPattern)]
      ],
      minPaymentRate: [defaultMinPaymentRate,
        [Validators.required, Validators.pattern(numberPattern)]
      ],
      minPayment: {value: (defaultLimit * (defaultMinPaymentRate / 100)) , disabled: true},
      apr: [defaultApr,
        [Validators.required, Validators.pattern(numberPattern)]
      ],
      dailyInterestRate: {value: (defaultApr / 100 / calendarDays), disabled: true},
      monthlyBalance: [defaultMonthlyBalance,
        [Validators.required, Validators.pattern(currencyPattern)]
      ],
      daysInMonth: [30,
        [Validators.required, Validators.pattern(numberPattern)]
      ],
      monthlyInterestCharge: {value: '?', disabled: true},
      monthlyPrincipalPayment: {value: '?', disabled: true}
    });
  }

  calculate() {
      const minPaymentControl = this.form.get('minPayment');
      const monthlyBalanceControl = this.form.get('monthlyBalance');
      const dailyInterestRateControl = this.form.get('dailyInterestRate');
      const daysInMonthControl = this.form.get('daysInMonth');
      const monthlyInterestChargeControl = this.form.get('monthlyInterestCharge');
      const monthlyPrincipalPaymentControl = this.form.get('monthlyPrincipalPayment');

      const interestCharge = monthlyBalanceControl.value * dailyInterestRateControl.value * daysInMonthControl.value;
      monthlyInterestChargeControl.setValue(this.currencyPipe.transform(interestCharge, 'USD', '', '1.2-2'));

      const principalPayment = minPaymentControl.value - interestCharge;
      monthlyPrincipalPaymentControl.setValue(this.currencyPipe.transform(principalPayment, 'USD', '', '1.2-2'));
  }

}
