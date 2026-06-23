{
  description = "hibi-vue";
  inputs.nixpkgs.url = "github:nixos/nixpkgs/26.05";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {inherit system;};
    in {
      devShell = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs_24
        ];
        VITE_BACK = "http://localhost:3003";
      };

      packages.default = pkgs.buildNpmPackage {
        name = "hibi-vue";

        buildInputs = with pkgs; [
          nodejs_24
        ];

        src = self;

        npmDepsHash = "sha256-8brStCdI6AepF52UOn+opOAXQ6goRwzGThkdMFIgiuA=";

        VITE_BACK = "https://api.hibiflow.ru";
        npmBuild = "npm run build";

        installPhase = ''
          mkdir $out
          cp -r dist/* $out/
        '';
      };
    });
}
