<script>
  import {
    MDBContainer,
    MDBRow,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCol,
    MDBInputGroup,
  } from "mdbsvelte";

  // https://www.gobankingrates.com/loans/home-equity/how-interest-calculated-heloc/

  const question = "?";
  const percent = 100;
  const calendarDays = 365;

  const defaultHelocLimit = 100000;
  const defaultMinPaymentRate = 0.659;
  const defaultMonthlyBalance = 96597.87;
  const defaultApr = 2.75;
  const defaultDaysIMonth = 30;

  let helocLimit = defaultHelocLimit;
  let minPaymentRate = defaultMinPaymentRate;
  let minPayment = defaultHelocLimit * (defaultMinPaymentRate / percent);
  let apr = defaultApr;
  let dailyInterestRate = defaultApr / percent / calendarDays;
  let monthlyBalance = defaultMonthlyBalance;
  let daysInMonth = defaultDaysIMonth;
  let interestCharge = question;
  let principalPayment = question;

  // Reactive declarations that depend on other fields.
  $: minPayment = helocLimit * (minPaymentRate / percent);
  $: dailyInterestRate = apr / percent / calendarDays;

  function calculate() {
    interestCharge = monthlyBalance * dailyInterestRate * daysInMonth;
    principalPayment = minPayment - interestCharge;
  }

  function reset() {
    helocLimit = defaultHelocLimit;
    minPaymentRate = defaultMinPaymentRate;
    apr = defaultApr;
    monthlyBalance = defaultMonthlyBalance;
    daysInMonth = defaultDaysIMonth;
    interestCharge = question;
    principalPayment = question;
  }
</script>

<MDBContainer>
  <MDBRow class="py-3">
    <MDBCol>
      <MDBCard>
        <MDBCardBody>
          <MDBCardTitle><h4>Heloc Interest Calculator</h4></MDBCardTitle>
          <MDBCardText>
            <form>
              <MDBRow>
                <MDBCol xl="4">
                  <MDBInputGroup
                    label="Heloc Limit"
                    type="number"
                    prepend="$"
                    append=".00"
                    required
                    bind:value={helocLimit}
                  />
                </MDBCol>
                <MDBCol xl="4">
                  <MDBInputGroup
                    label="Min Payment Rate"
                    type="number"
                    prepend="%"
                    required
                    bind:value={minPaymentRate}
                  />
                  <div class="invalid-feedback">Please choose a username.</div>
                </MDBCol>
                <MDBCol xl="4">
                  <MDBInputGroup
                    label="Min Payment"
                    prepend="$"
                    class="disabled"
                    bind:value={minPayment}
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol xl="4">
                  <MDBInputGroup
                    label="APR"
                    type="number"
                    prepend="%"
                    required
                    bind:value={apr}
                  />
                </MDBCol>
                <MDBCol xl="4">
                  <MDBInputGroup
                    label="Daily Interest Rate"
                    class="disabled"
                    bind:value={dailyInterestRate}
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol xl="4">
                  <MDBInputGroup
                    label="Monthly Balance"
                    type="number"
                    prepend="$"
                    required
                    bind:value={monthlyBalance}
                  />
                </MDBCol>
                <MDBCol xl="4">
                  <MDBInputGroup
                    label="Days in Month"
                    type="number"
                    bind:value={daysInMonth}
                  />
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol>
                  <MDBBtn color="primary" on:click={calculate}>Calculate</MDBBtn
                  >
                  <MDBBtn color="primary" on:click={reset}>Reset</MDBBtn>
                </MDBCol>
              </MDBRow>
              <MDBRow>
                <MDBCol xl="4">
                  <MDBInputGroup
                    label="Monthly Interest Charge"
                    prepend="$"
                    class="disabled"
                    bind:value={interestCharge}
                  />
                </MDBCol>
                <MDBCol xl="4">
                  <MDBInputGroup
                    label="Monthly Principal Payment"
                    prepend="$"
                    class="disabled"
                    bind:value={principalPayment}
                  />
                </MDBCol>
              </MDBRow>
            </form>
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  </MDBRow>
</MDBContainer>
