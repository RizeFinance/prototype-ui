import { createMachine, assign } from 'xstate';
import { CustomerService, ProductService, ComplianceWorkflowService } from '../../services';

// HAndle expired state

export const disclosuresMachine = createMachine(
  {
    initial: 'loading',
    context: {
      errorMessage: undefined,
      currentStepDocumentsPending: [],
      currentStep: undefined,
      screenTitle: '',
      workflow: {},
    },
    states: {
      loading: {
        on: {
          INIT_WORKFLOW: {
            target: 'loaded',
            actions: ['setPendingSteps'],
          },
        },
      },
      loaded: {
        always: [
          { target: 'step1', cond: (cxt, _event: any) => cxt.currentStep === 1 },
          { target: 'step2', cond: (cxt, _event: any) => cxt.currentStep === 2 },
          { target: 'step3', cond: (cxt, _event: any) => cxt.currentStep === 3 },
        ],
      },
      step1: {
        id: 'step1',
        initial: 'idle',
        states: {
          idle: {
            on: {
              SUBMIT: {
                target: 'submitting',
              },
            },
          },
          submitting: {
            // invoke: {
            //   src: 'sendData',
            //    onDone: [{
            //      target: '#step2'
            //    }]
            // }
          },
        },
      },
      step2: {
        id: 'step2',
        initial: 'patriotAct',
        states: {
          patriotAct: {
            on: {
              SUBMIT: 'submittingPatriotAct',
            },
          },
          submittingPatriotAct: {
            // invoke: {
            // submit act
            // success
            // failure
            // target: 'showPIIForm'
            // }
          },
          showPIIForm: {
            on: {
              SUBMIT: 'showConfirm',
            },
          },
          showConfirm: {
            on: {
              // SUBMIT: {
              // submit data
              //   target: '#step3'
              // },
              EDIT: {
                target: 'showPIIForm',
              },
            },
          },
        },
      },
      step3: {
        on: {
          SUBMIT: 'processing',
        },
      },
      processing: {
        // invoke: {
        // src
        // onDone: [
        // ]
        // }
      },
    },
  },
  {
    actions: {
      setPendingSteps: assign((_ctx, event: any) => ({
        currentStepDocumentsPending: event.workflow.current_step_documents_pending,
        currentStep: event.workflow.summary.current_step,
      })),
    },
    guards: {
      isCurrentStep: (ctx, event) => {
        console.log(event, 'event');
        return event;
      },
    },
  }
);
