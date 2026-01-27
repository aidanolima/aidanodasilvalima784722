import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PetCard } from './PetCard';
import '@testing-library/jest-dom';

const mockPet = {
  id: 239,
  nome: "Rex",
  especie: 'Cachorro' as any, // Adicione o 'as any' ou o tipo 'as PetEspecie'
  idade: 5,
  raca: "ChowChow",
  urlFoto: ""
};

describe('PetCard', () => {
  it('deve exibir nome, espécie e idade do pet', () => {
    render(
      <PetCard 
        pet={mockPet} 
        onEdit={() => {}} 
        onDelete={() => {}} 
      />
    );

    expect(screen.getByText(/LUNA/i)).toBeInTheDocument();
    expect(screen.getByText(/GATO/i)).toBeInTheDocument();
    expect(screen.getByText(/3 Anos/i)).toBeInTheDocument();
  });

  it('deve disparar a função de edição ao clicar no card', () => {
    const onEditMock = vi.fn();
    render(
      <PetCard 
        pet={mockPet} 
        onEdit={onEditMock} 
        onDelete={() => {}} 
      />
    );

    const card = screen.getByText(/LUNA/i).closest('div');
    if (card) fireEvent.click(card);

    expect(onEditMock).toHaveBeenCalledWith(mockPet.id);
  });
});