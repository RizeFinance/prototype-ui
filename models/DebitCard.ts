import { DebitCard as BaseDebitCard } from '@rizefinance/rize-js/types/lib/core/typedefs/debit-card.typedefs';

export interface DebitCard extends BaseDebitCard {
  card_last_four_digit: string;
}
