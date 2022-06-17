import {ObservableInput} from 'rxjs';
import {BadRequestException, UnauthorizedException} from '@nestjs/common';
import SpoonError from 'SpoonError';
import SpoonAndForkAuthError, {
  SpoonAuthErrorType,
} from 'managers/auth/SpoonAndForkAuthError';

function processAuthError(error: SpoonAndForkAuthError) {
  switch (error.type) {
    case SpoonAuthErrorType.TokenExpired:
    case SpoonAuthErrorType.AuthFailed:
    case SpoonAuthErrorType.RefreshFailed:
      throw new UnauthorizedException(error.message);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function processError(error: any): ObservableInput<any> {
  if (error instanceof SpoonError) {
    if (error instanceof SpoonAndForkAuthError) {
      processAuthError(error);
    }
    throw new BadRequestException(error.message);
  } else {
    throw error;
  }
}
