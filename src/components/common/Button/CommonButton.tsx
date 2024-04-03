import { type ReactNode } from 'react'
import { Btn, BtnSpan } from './styles'

interface ButtonProps {
  children: ReactNode
  size: 'small' | 'large'
  handleClick?: () => void
}

// 추후에 onClick이벤트 추가 (현재는 타입에러 때문에 빼두었음)
function CommonButton({
  children,
  size,
  handleClick,
}: ButtonProps): JSX.Element {
  return (
    <Btn type="submit" size={size} onClick={handleClick}>
      <BtnSpan>{children}</BtnSpan>
    </Btn>
  )
}

CommonButton.defaultProps = {
  handleClick: () => {},
}

export default CommonButton
