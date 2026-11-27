import {fireEvent,render,screen} from '@testing-library/react';
import {describe,expect,it} from 'vitest';
import {FlashcardGame,flashcardDecks} from './FlashcardGame';

describe('FlashcardGame',()=>{
  it('offers the Stone Age deck and hides the answer before flipping',()=>{
    render(<FlashcardGame/>);
    expect(screen.getByRole('heading',{name:'Steinzeit'})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Lernen starten'}));
    const first=flashcardDecks[0].cards[0];
    expect(screen.getByText(first.question)).toBeInTheDocument();
    expect(screen.queryByText(first.answer)).not.toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Gewusst'})).toBeDisabled();
    fireEvent.click(screen.getByRole('button',{name:/Antwort anzeigen/}));
    expect(screen.getByText(first.answer)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:/Frage anzeigen/}));
    expect(screen.getByText(first.question)).toBeInTheDocument();
  });

  it('scores a complete round and repeats only missed cards',()=>{
    render(<FlashcardGame/>);
    fireEvent.click(screen.getByRole('button',{name:'Lernen starten'}));
    const cards=flashcardDecks[0].cards;
    for(let index=0;index<cards.length;index++){
      expect(screen.getByText(cards[index].question)).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button',{name:/Antwort anzeigen/}));
      fireEvent.click(screen.getByRole('button',{name:index===0?'Nochmal lernen':'Gewusst'}));
    }
    expect(screen.getByText((cards.length-1)+' von '+cards.length+' Karten gewusst.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Nur offene Karten wiederholen'}));
    expect(screen.getByText('Karte 1 von 1')).toBeInTheDocument();
    expect(screen.getByText(cards[0].question)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:/Antwort anzeigen/}));
    fireEvent.click(screen.getByRole('button',{name:'Gewusst'}));
    expect(screen.getByText('Super! Du hast alle Karten gewusst.')).toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'Nur offene Karten wiederholen'})).not.toBeInTheDocument();
  });
});
