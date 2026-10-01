import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Adresse e-mail invalide.' })
  email!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  displayName!: string;

  /** Politique de mot de passe : 10 caractères minimum, lettres et chiffres. */
  @IsString()
  @MinLength(10, { message: 'Le mot de passe doit contenir au moins 10 caractères.' })
  @MaxLength(128)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Le mot de passe doit contenir au moins une lettre et un chiffre.',
  })
  password!: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'Adresse e-mail invalide.' })
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;

  /** Code TOTP à six chiffres, requis lorsque la 2FA est activée. */
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Le code de vérification doit comporter 6 chiffres.' })
  totp?: string;
}

export class RefreshTokenDto {
  @IsString()
  @MinLength(1)
  refreshToken!: string;
}

export class VerifyTwoFactorDto {
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Le code de vérification doit comporter 6 chiffres.' })
  code!: string;
}

export class DisableTwoFactorDto {
  @IsString()
  @MinLength(1)
  password!: string;

  @IsString()
  @Matches(/^\d{6}$/)
  code!: string;
}
