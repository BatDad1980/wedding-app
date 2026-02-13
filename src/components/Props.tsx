import React from 'react';
import { Guest } from '../types';

export interface Props {
    guests: Guest[];
    setGuests: React.Dispatch<React.SetStateAction<Guest[]>>;
}
