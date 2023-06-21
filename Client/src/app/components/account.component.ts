import { Component, OnInit } from '@angular/core';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit{

  email!: string;
  tokens: any[] = [];
  liquidities: any[] = [];
  swaps: any[] = [];

  constructor(private tokenService: TokenService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserEmail().subscribe(email => {
      this.email = email;
      this.getTokensByEmail();
      this.getLiquidityByEmail();
      this.getSwapByEmail();
    });
  }

  getTokensByEmail(): void {
    this.tokenService.getTokensByEmail(this.email)
      .subscribe(tokens => this.tokens = tokens);
  }

  getLiquidityByEmail(): void {
    this.tokenService.getLiquidityByEmail(this.email)
      .subscribe(liquidities => this.liquidities = liquidities);
  }

  getSwapByEmail(): void {
    this.tokenService.getSwapByEmail(this.email)
      .subscribe(swaps => this.swaps = swaps);
  }
}
