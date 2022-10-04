const steps = [
  {
    header: 'Complete Your Financial Profile',
    questions: [
      {
        name: 'Employment Status',
        placeholder: 'Select Employment Status',
      },
      {
        name: 'Annual Salary',
        pattern: '^[0-9]*$',
      },
      {
        name: 'Are any of the account holders affiliated with or employed by a stock exchange, member firm of an exchange or FINRA, or a municipal securities broker-dealer?',
      },
      {
        name: 'Are any of the account holders a control person of a publicly traded company? A Director, Officer or 10% stock owner?',
      },
      {
        name: 'Is the account maintained for a current or former Politically Exposed Person or Public Official (includes U.S. and Foreign)? A politically exposed person is someone who has been entrusted with a prominent public function, or who is closely related to such a person.',
      },
    ],
  },
  {
    header: 'Complete Your Financial Profile',
    questions: [
      {
        name: 'Employer Name',
        placeholder: 'Employer Name',
        pattern: '[a-zA-Z]+',
      },
      {
        name: 'Occupation',
        placeholder: 'Occupation',
        pattern: '[a-zA-Z]+',
      },
      {
        name: 'Number of Dependents',
        placeholder: 'Enter Number of Dependents',
        pattern: '^[0-9]*$',
      },
      {
        name: 'Net Worth',
        placeholder: '$0',
        pattern: '^[0-9]*$',
      },
      {
        name: 'Approximate Value of all Investments',
        placeholder: '$0',
        pattern: '^[0-9]*$',
      },
      {
        name: 'Tax Bracket',
        placeholder: 'Select Tax Bracket',
      },
    ],
  },
  {
    header: 'Investment Experience',
    questions: [
      {
        name: 'How would you describe your investment knowledge?',
        placeholder: 'Select Investment Experience',
      },
    ],
  },
  {
    header: 'Time Horizon and Liquidity Needs (When do I need my money?)',
    subHeader:
      'Your time horizon is the number of years you have to achieve your investment objectives. It represents the time when you expect to begin withdrawing some or all of the money from your portfolio.',
    questions: [
      {
        name: 'When do I anticipate needing to make a withdrawal from my portfolio?',
        placeholder: 'Select Withdrawal Timeframe',
      },
    ],
  },
  {
    header: 'Investment Objectives',
    questions: [
      {
        name: 'Which of the following best describes my investment goal?',
        context: '(Number, in order of preference, from 1 to 4 with 1 being most important)',
        note: 'Note: This product is designed with the goal of income and capital preservation. If you have other investment goals, you should seek out an alternative financial product that would meet those goals.',
      },
      {
        name: 'My goal for my portfolio is to:',
        note: 'Note: This product is designed to not lose money, grow slightly, or grow moderately. If you are looking for a financial product that will grow significantly, you should seek out an alternative financial product that would meet your goals.',
        placeholder: 'Select Portfolio Goal',
        validations: [
          {
            choice: 'Not lose money',
            errorMessage:
              'This investment product is not suitable for you if you have selected: ‘not lose money.’ In order to open an account, select another goal.',
          },
        ],
      },
      {
        name: 'I expect my portfolio to:',
        note: 'Note: This product is not designed to grow faster than the stock market average. If you are looking for a financial product that will grow faster than the stock market.',
        placeholder: 'Select Portfolio Expectation',
      },
    ],
  },
  {
    header: 'Risk Temperament',
    subHeader:
      'Your risk temperament, or risk tolerance reflects your willingness to risk losing some or all of your original investment in an effort to achieve potentially higher returns. :',
    questions: [
      {
        name: 'I would classify myself as a(n):',
        placeholder: 'Select Classification',
      },
      {
        name: 'Which of the following statements best describes me?',
        placeholder: 'Select Description',
        validations: [
          {
            choice: 'I cannot tolerate any fluctuations in the value of my portfolio',
            errorMessage:
              'This investment product is not suitable for you if you have selected: ‘I cannot tolerate any fluctuations in the value of my portfolio.’ In order to open an account, select another statement.',
          },
        ],
      },
      {
        name: 'If the investments in my portfolio dropped more than 20 percent in value, I would:',
        placeholder: 'Select Response',
      },
    ],
  },
];

export default steps;
