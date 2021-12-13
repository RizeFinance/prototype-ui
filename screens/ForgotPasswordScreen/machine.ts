import { createMachine, assign } from 'xstate';

interface IMachineContext {
  message: string | undefined;
  code: string;
  email: string;
  password: string;
}

type MachineEvents =
  | { type: 'SUBMIT_EMAIL'; email: string }
  | { type: 'SUBMIT_CODE'; code: string }
  | { type: 'SUBMIT_PASSWORD'; password: string };

export const machine = createMachine<IMachineContext, MachineEvents>(
  {
    id: 'resetPassword',
    initial: 'email',
    context: {
      message: undefined,
      code: '',
      email: '',
      password: '',
    },
    states: {
      email: {
        id: 'email',
        initial: 'idle',
        exit: ['clearMessage'],
        states: {
          idle: {
            on: {
              SUBMIT_EMAIL: { target: 'submittingEmail', actions: ['setEmail'] },
            },
          },
          submittingEmail: {
            invoke: {
              src: 'fetchCode',
              onDone: [
                {
                  target: '#code',
                  actions: assign({
                    message: (_ctx, event: any) => event.data.message,
                  }),
                  cond: (_ctx, event: any) => {
                    if (event.data.success) {
                      return true;
                    } else {
                      return false;
                    }
                  },
                },
                {
                  target: 'idle',
                  actions: assign({
                    message: (ctx, event: any) => event.data.message,
                    email: '',
                  }),
                },
              ],
              onError: {
                target: 'idle',
                actions: assign({
                  message: 'Something went wrong.',
                }),
              },
            },
          },
        },
      },
      code: {
        id: 'code',
        initial: 'idle',
        states: {
          idle: {
            on: {
              SUBMIT_CODE: {
                target: 'submit',
                actions: ['setCode'],
              },
            },
          },
          submit: {
            exit: ['clearMessage'],
            always: {
              target: '#password',
            },
          },
        },
      },
      password: {
        id: 'password',
        initial: 'idle',
        states: {
          idle: {
            on: {
              SUBMIT_PASSWORD: { target: 'submitting', actions: ['setPassword'] },
            },
          },
          submitting: {
            invoke: {
              src: 'confirmPassword',
              onDone: {
                target: '#login',
              },
              onError: {
                target: 'idle',
                actions: assign({
                  message: () => 'Something went wrong. Please try again later.',
                  password: '',
                }),
              },
            },
          },
        },
      },
      login: {
        id: 'login',
        initial: 'loggingIn',
        states: {
          loggingIn: {
            invoke: {
              src: 'login',
              onDone: [
                {
                  target: 'showLoader',
                  actions: assign({
                    message: (_ctx, event: any) => event.data.message,
                  }),
                  cond: (_ctx, event: any) => {
                    if (event.data.success) {
                      return true;
                    } else {
                      return false;
                    }
                  },
                },
                {
                  target: '#password',
                  actions: assign({
                    message: (_ctx, event: any) => event.data.message,
                    password: '',
                  }),
                },
              ],
              onError: {
                target: '#password',
                actions: assign({
                  message: () => 'Something went wrong. Please try again later.',
                }),
              },
            },
          },
          showLoader: {
            after: {
              3000: { target: 'success' },
            },
          },
          success: {
            type: 'final',
          },
        },
      },
    },
  },
  {
    actions: {
      setEmail: assign((_ctx, event: any) => ({
        email: event.email,
      })),
      setPassword: assign((_ctx, event: any) => ({
        password: event.password,
      })),
      setCode: assign((_ctx, event: any) => ({
        code: event.code,
      })),
      clearMessage: assign(() => ({
        message: undefined,
      })),
    },
  }
);
