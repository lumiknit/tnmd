import { BsGithub } from "solid-icons/bs";
import { Component } from "solid-js";

export const NavBar: Component = () => {
	return (
		<nav class="navbar navbar-expand-sm bg-body-tertiary">
			<div class="container-fluid">
				<a class="navbar-brand" href="#">
					TNMD
				</a>
				<button
					class="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarSupportedContent">
					<ul class="navbar-nav">
						<li class="nav-item">
							<a
								class="nav-link active d-flex align-items-center gap-1"
								aria-current="page"
								href="https://github.com/lumiknit/tnmd">
								<BsGithub />
								Github
							</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};
