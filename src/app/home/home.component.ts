import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  // Constant
  private readonly calcDelay: number = 1000;
  private readonly percent: number = 100;
  private readonly calendarDays: number = 365;

  form: FormGroup;
  limitControl: AbstractControl;
  minPaymentRateControl: AbstractControl;
  minPaymentControl: AbstractControl;
  aprControl: AbstractControl;
  dailyInterestRateControl: AbstractControl;
  monthlyBalanceControl: AbstractControl;
  daysInMonthControl: AbstractControl;
  monthlyInterestChargeControl: AbstractControl;
  monthlyPrincipalPaymentControl: AbstractControl;

  private unsubscribe = new Subject<void>();  // variable to unsubscribe from valueChanges observables.

  constructor(private fb: FormBuilder, private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    const defaultLimit = 100000;
    const defaultMinPaymentRate = 0.659;
    const defaultMonthlyBalance = 96597.87;
    const defaultApr = 2.75;
    const numberPattern = '^\\d*\.?\\d+$';
    const currencyPattern = '^[0-9]{1,3}(?:,?[0-9]{3})*(?:\.[0-9]{2})?$';

    this.form = this.fb.group({
      limit: [defaultLimit,
        [Validators.required, Validators.pattern(currencyPattern)]
      ],
      minPaymentRate: [defaultMinPaymentRate,
        [Validators.required, Validators.pattern(numberPattern)]
      ],
      minPayment: { value: (defaultLimit * (defaultMinPaymentRate / this.percent)), disabled: true },
      apr: [defaultApr,
        [Validators.required, Validators.pattern(numberPattern)]
      ],
      dailyInterestRate: { value: (defaultApr / this.percent / this.calendarDays), disabled: true },
      monthlyBalance: [defaultMonthlyBalance,
        [Validators.required, Validators.pattern(currencyPattern)]
      ],
      daysInMonth: [30,
        [Validators.required, Validators.pattern(numberPattern)]
      ],
      monthlyInterestCharge: { value: '?', disabled: true },
      monthlyPrincipalPayment: { value: '?', disabled: true }
    });

    this.getFormControls();
    this.onChanges();
  }

  private getFormControls() {
    this.limitControl = this.form.get('limit');
    this.minPaymentRateControl = this.form.get('minPaymentRate');
    this.minPaymentControl = this.form.get('minPayment');
    this.aprControl = this.form.get('apr');
    this.dailyInterestRateControl = this.form.get('dailyInterestRate');
    this.monthlyBalanceControl = this.form.get('monthlyBalance');
    this.daysInMonthControl = this.form.get('daysInMonth');
    this.monthlyInterestChargeControl = this.form.get('monthlyInterestCharge');
    this.monthlyPrincipalPaymentControl = this.form.get('monthlyPrincipalPayment');
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  calculate() {
    const interestCharge = this.monthlyBalanceControl.value * this.dailyInterestRateControl.value * this.daysInMonthControl.value;
    this.monthlyInterestChargeControl.setValue(this.currencyPipe.transform(interestCharge, 'USD', '', '1.2-2'));

    const principalPayment = this.minPaymentControl.value - interestCharge;
    this.monthlyPrincipalPaymentControl.setValue(this.currencyPipe.transform(principalPayment, 'USD', '', '1.2-2'));
  }

  private onChanges() {
    // Auto calculate ROI when noi or purchasePrice changes.
    let minPayment = 0;
    this.limitControl.valueChanges
      .pipe(
        debounceTime(this.calcDelay),
        takeUntil(this.unsubscribe)
      )
      .subscribe(val => {
        if (this.limitControl.valid && this.minPaymentRateControl) {
          minPayment = val * (this.minPaymentRateControl.value / this.percent);
        }
        this.minPaymentControl.setValue(minPayment);
      });

    this.minPaymentRateControl.valueChanges
      .pipe(
        debounceTime(this.calcDelay),
        takeUntil(this.unsubscribe)
      )
      .subscribe(val => {
        if (this.limitControl.valid && this.minPaymentRateControl.valid) {
          minPayment = this.limitControl.value * (val / this.percent);
        }
        this.minPaymentControl.setValue(minPayment);
      });

    let dailyInterest = 0;
    this.aprControl.valueChanges
    .pipe(
      debounceTime(this.calcDelay),
      takeUntil(this.unsubscribe)
    )
    .subscribe(val => {
      if (this.aprControl.valid) {
        dailyInterest = val / this.percent / this.calendarDays;
      }
      this.dailyInterestRateControl.setValue(dailyInterest);
    });
  }

}
