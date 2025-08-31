import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../components/Button';

describe('Button Component', () => {
    it('renders correctly with default props', () => {
        render(<Button>Click Me</Button>);
        const button = screen.getByText('Click Me');
        
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('button');
        expect(button).toHaveClass('button-primary');
        expect(button).toHaveClass('button-medium');
    });
    
    it('applies variant class correctly', () => {
        render(<Button variant="secondary">Secondary Button</Button>);
        const button = screen.getByText('Secondary Button');
        
        expect(button).toHaveClass('button-secondary');
    });
    
    it('applies size class correctly', () => {
        render(<Button size="small">Small Button</Button>);
        const button = screen.getByText('Small Button');
        
        expect(button).toHaveClass('button-small');
    });
    
    it('applies disabled state correctly', () => {
        render(<Button disabled>Disabled Button</Button>);
        const button = screen.getByText('Disabled Button');
        
        expect(button).toBeDisabled();
        expect(button).toHaveClass('button-disabled');
    });
    
    it('applies loading state correctly', () => {
        render(<Button loading>Loading Button</Button>);
        const button = screen.getByText('Loading Button');
        
        expect(button).toBeDisabled();
        expect(button).toHaveClass('button-loading');
    });
    
    it('calls onClick handler when clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Clickable Button</Button>);
        const button = screen.getByText('Clickable Button');
        
        fireEvent.click(button);
        
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
    
    it('does not call onClick handler when disabled', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick} disabled>Disabled Button</Button>);
        const button = screen.getByText('Disabled Button');
        
        fireEvent.click(button);
        
        expect(handleClick).not.toHaveBeenCalled();
    });
    
    it('does not call onClick handler when loading', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick} loading>Loading Button</Button>);
        const button = screen.getByText('Loading Button');
        
        fireEvent.click(button);
        
        expect(handleClick).not.toHaveBeenCalled();
    });
});

