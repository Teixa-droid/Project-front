import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ButtonLoading from '../components/ButtonLoading';

afterEach(cleanup);
it('renders okay', () => {
  render(<ButtonLoading text='hello' loading={false} disabled={false} />);
  expect(screen.getByTestId('button-loading')).toBeInTheDocument();
});

it('shows text when not loading', () => {
  render(<ButtonLoading text='hello' loading={false} disabled={false} />);
  expect(screen.getByTestId('button-loading')).toHaveTextContent('hello');
});
it('doesnt show text when loading', () => {
  render(<ButtonLoading text='hello' loading={true} disabled={false} />);
  expect(screen.getByTestId('button-loading')).not.toHaveTextContent('hello');
});

it('shows loading component when loading', () => {
  render(<ButtonLoading text='hello' loading={true} disabled={false} />);
  expect(screen.getByTestId('loading-in-button')).toBeInTheDocument();
});

it('is disabled when prop is passed', () => {
  render(<ButtonLoading text='hello' loading={true} disabled={true} />);
  expect(screen.getByTestId('button-loading')).toHaveAttribute('disabled');
});

it('is enabled when disabled prop is passed as false', () => {
  render(<ButtonLoading text='hello' loading={true} disabled={false} />);
  expect(screen.getByTestId('button-loading')).not.toHaveAttribute('disabled');
});

it('loads the svg html when loading is activated', () => {
  render(<ButtonLoading text='hello' loading={true} disabled={false} />);
  expect(screen.getByTestId('button-loading')).toMatchSnapshot();
});
