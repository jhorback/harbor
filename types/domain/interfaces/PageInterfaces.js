export var PageSize;
(function (PageSize) {
    PageSize["small"] = "small";
    PageSize["medium"] = "medium";
    PageSize["large"] = "large";
    PageSize["wide"] = "wide";
    PageSize["full"] = "full";
})(PageSize || (PageSize = {}));
export const SearchPagesRepoKey = Symbol("SEARCH_PAGES_REPO");
export const EditPageRepoKey = Symbol("EDIT_PAGE_REPO");
export const AddPageRepoKey = Symbol("ADD_PAGE_REPO");
export const DeletePageRepoKey = Symbol("DELETE_PAGE_REPO");
export const HomePageRepoKey = Symbol("HOME_PAGE_REPO_KEY");
